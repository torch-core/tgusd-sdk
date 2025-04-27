import {
  Address,
  beginCell,
  Builder,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Dictionary,
  SenderArguments,
  toNano,
} from '@ton/core';
import { Op } from '../common/Opcode';
import { Asset, AssetType, coinsMarshaller } from '@torch-finance/core';
import { packJettonWalletInit, storeJettonBurnMessage, storeJettonTransferMessage } from '../common/jetton';
import { MERKLE_ROOT_SIZE, OPCODE_SIZE, SIGNATURE_SIZE, SIGNER_KEY_SIZE } from '../common/Size';
import { JettonMaster } from '@ton/ton';
import { JETTON_WALLET_CODE } from '../common/ContractCode';
import { MintOrderParams, RedeemOrderParams } from './type';
import { tgUSDEngineStorage } from './storage';

export class tgUSDEngine implements Contract {
  constructor(
    readonly address: Address,
    readonly tgUSDJettonMaster?: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address, tgUSDJettonMaster?: Address) {
    return new tgUSDEngine(address, tgUSDJettonMaster);
  }

  private getTgUSDJettonWalletAddress(ownerAddress: Address, tgUSDJettonMaster: Address, workchain = 0) {
    return contractAddress(workchain, {
      code: JETTON_WALLET_CODE,
      data: packJettonWalletInit(ownerAddress, tgUSDJettonMaster),
    });
  }

  private storeMintMessage(params: MintOrderParams) {
    return (builder: Builder) => {
      return builder
        .storeUint(Op.Engine.DepositFP, OPCODE_SIZE)
        .storeBuffer(params.signature, SIGNATURE_SIZE)
        .storeRef(params.order)
        .storeAddress(params.recipient)
        .endCell();
    };
  }

  private storeRedeemMessage(params: RedeemOrderParams) {
    return (builder: Builder) => {
      return builder
        .storeUint(Op.Engine.RequestRedeem, OPCODE_SIZE)
        .storeBuffer(params.signature, SIGNATURE_SIZE)
        .storeRef(params.order)
        .storeRef(params.redeemWhitelistProof)
        .endCell();
    };
  }

  async getMintPayload(
    provider: ContractProvider,
    sender: Address,
    params: MintOrderParams,
    transferGas: bigint = toNano('0.08'),
    forwardAmount: bigint = toNano('0.12'),
  ): Promise<SenderArguments> {
    if (params.collateralInfo.collateralAsset.type != AssetType.JETTON) {
      throw new Error('Only jetton collateral is supported for now');
    }
    const jettonMasterAddress = params.collateralInfo.collateralAsset.jettonMaster;
    if (!jettonMasterAddress) {
      throw new Error('Jetton master address is not set');
    }
    const jettonMaster = provider.open(JettonMaster.create(jettonMasterAddress));
    const senderJettonWallet = await jettonMaster.getWalletAddress(sender);
    const forwardPayload = beginCell().store(this.storeMintMessage(params)).endCell();

    const transferMessage = beginCell()
      .store(
        storeJettonTransferMessage({
          queryId: params.queryId ?? 0n,
          amount: params.collateralInfo.collateralAmount,
          recipient: this.address,
          responseDst: sender,
          forwardAmount,
          forwardPayload,
        }),
      )
      .endCell();

    return {
      to: senderJettonWallet,
      value: transferGas + forwardAmount,
      body: transferMessage,
    };
  }

  async getRedeemPayload(
    provider: ContractProvider,
    sender: Address,
    params: RedeemOrderParams,
    burnGas: bigint = toNano('0.15'),
  ): Promise<SenderArguments> {
    let tgUSDJettonMasterAddress = this.tgUSDJettonMaster;
    if (!tgUSDJettonMasterAddress) {
      tgUSDJettonMasterAddress = (await this.getStorage(provider)).tgUSDJettonMaster;
    }
    const senderJettonWallet = this.getTgUSDJettonWalletAddress(sender, tgUSDJettonMasterAddress!);
    const forwardPayload = beginCell().store(this.storeRedeemMessage(params)).endCell();

    const transferMessage = beginCell()
      .store(
        storeJettonBurnMessage({
          queryId: params.queryId ?? 0n,
          amount: params.burnAmount,
          customPayload: forwardPayload,
        }),
      )
      .endCell();

    return {
      to: senderJettonWallet,
      value: burnGas,
      body: transferMessage,
    };
  }

  async getStorage(provider: ContractProvider): Promise<tgUSDEngineStorage> {
    const { state } = await provider.getState();
    if (state.type !== 'active' || !state.code || !state.data) {
      throw new Error('tgUSDEngine is not active');
    }

    const storageBoc = Cell.fromBoc(state.data)[0];
    if (!storageBoc) {
      throw new Error('tgUSDEngine is not initialized');
    }

    const storageSc = storageBoc.beginParse();
    const tgUSDJettonMaster = storageSc.loadAddress();
    const tgUSDStaking = storageSc.loadAddress();
    const isHalt = storageSc.loadBoolean();
    const redeemWhitelistRoot = storageSc.loadUintBig(MERKLE_ROOT_SIZE);
    const custodialWalletsDict = storageSc.loadDict(Dictionary.Keys.Address(), coinsMarshaller());
    const adminInfoSlice = storageSc.loadRef().beginParse();
    const admin = adminInfoSlice.loadAddress();
    const nextAdmin = adminInfoSlice.loadMaybeAddress();
    const signerKey = adminInfoSlice.loadBuffer(SIGNER_KEY_SIZE);

    const jettonInfoSlice = storageSc.loadRef().beginParse();
    const jettonMastersDict = jettonInfoSlice.loadDict(Dictionary.Keys.Address(), Dictionary.Values.Address());
    const jettonWalletsBalDict = jettonInfoSlice.loadDict(Dictionary.Keys.Address(), coinsMarshaller());

    const contractsCodeSlice = storageSc.loadRef().beginParse();
    const baseCode = contractsCodeSlice.loadRef();
    const redeemAccountCode = contractsCodeSlice.loadRef();

    const storage: tgUSDEngineStorage = {
      tgUSDJettonMaster: tgUSDJettonMaster,
      tgUSDStaking,
      isHalt,
      redeemWhitelistRoot,
      custodialWallets: custodialWalletsDict,
      admin,
      nextAdmin,
      signerKey,
      jettonMastersDict: jettonMastersDict,
      jettonWalletsBal: jettonWalletsBalDict,
      baseCode,
      redeemAccountCode,
    };

    return storage;
  }

  async getRedeemAccountAddress(provider: ContractProvider, redeemer: Address, redeemAsset: Asset) {
    const result = await provider.get('redeemAccount', [
      { type: 'slice', cell: beginCell().storeAddress(redeemer).endCell() },
      { type: 'cell', cell: redeemAsset.toCell() },
    ]);
    return result.stack.readAddress();
  }
}
