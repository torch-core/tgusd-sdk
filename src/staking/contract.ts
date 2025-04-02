import {
  Address,
  beginCell,
  Builder,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  SenderArguments,
  toNano,
} from '@ton/core';
import { OPCODE_SIZE, QUERY_ID_SIZE, TIMESTAMP_SIZE } from '../common/Size';
import { Op } from '../common/Opcode';
import { packJettonWalletInit, storeJettonBurnMessage, storeJettonTransferMessage } from '../common/jetton';
import { JETTON_WALLET_CODE } from '../common/ContractCode';
import { JettonMaster } from '@ton/ton';
import { ConversionRatio, ProvideCurrentQuoteParams, StakeParams } from './type';
import { tgUSDStakingStorage } from './storage';

export class tgUSDStaking implements Contract {
  constructor(
    readonly address: Address,
    readonly tgUSDJettonMaster: Address,
    readonly stgUSDJettonMaster?: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address, tgUSDJettonMaster: Address, stgUSDJettonMaster?: Address) {
    return new tgUSDStaking(address, tgUSDJettonMaster, stgUSDJettonMaster);
  }

  private getStgUSDJettonWalletAddress(ownerAddress: Address, stgUSDJettonMaster: Address, workchain = 0) {
    return contractAddress(workchain, {
      code: JETTON_WALLET_CODE,
      data: packJettonWalletInit(ownerAddress, stgUSDJettonMaster),
    });
  }

  private storeProvideCurrentQuoteParams(params: ProvideCurrentQuoteParams) {
    return (builder: Builder) => {
      return builder
        .storeUint(Op.Staking.ProvideCurrentQuote, OPCODE_SIZE)
        .storeUint(params.queryId, QUERY_ID_SIZE)
        .storeAddress(params.recipient)
        .storeMaybeRef(params.customPayload)
        .endCell();
    };
  }

  async getStakePayload(
    provider: ContractProvider,
    sender: Address,
    params: StakeParams,
    transferGas: bigint = toNano('0.07'),
    forwardAmount: bigint = toNano('0.12'),
  ): Promise<SenderArguments> {
    const jettonMasterAddress = this.tgUSDJettonMaster;
    if (!jettonMasterAddress) {
      throw new Error('Jetton master address is not set');
    }
    const jettonMaster = provider.open(JettonMaster.create(jettonMasterAddress));
    const senderJettonWallet = await jettonMaster.getWalletAddress(sender);
    const transferMessage = beginCell()
      .store(
        storeJettonTransferMessage({
          queryId: params.queryId,
          amount: params.stakeAmount,
          recipient: this.address,
          responseDst: sender,
          forwardAmount,
          forwardPayload: beginCell()
            .storeUint(Op.Staking.StakeFp, OPCODE_SIZE)
            .storeAddress(params.recipient)
            .endCell(),
        }),
      )
      .endCell();

    return {
      to: senderJettonWallet,
      value: transferGas + forwardAmount,
      body: transferMessage,
    };
  }

  async getUnstakePayload(
    provider: ContractProvider,
    sender: Address,
    burnAmount: bigint,
    queryId: bigint = 8n,
    burnGas: bigint = toNano('0.12'),
  ): Promise<SenderArguments> {
    let stgUSDJettonMasterAddress = this.stgUSDJettonMaster;
    if (!stgUSDJettonMasterAddress) {
      stgUSDJettonMasterAddress = (await this.getStorage(provider)).stgUSDJettonMaster;
    }
    const senderJettonWallet = this.getStgUSDJettonWalletAddress(sender, stgUSDJettonMasterAddress!);
    const customPayload = beginCell().storeUint(Op.Staking.UnstakeFp, OPCODE_SIZE).endCell();

    const burnMessage = beginCell()
      .store(
        storeJettonBurnMessage({
          queryId,
          amount: burnAmount,
          customPayload,
        }),
      )
      .endCell();

    return {
      to: senderJettonWallet,
      value: burnGas,
      body: burnMessage,
    };
  }

  async getProvideCurrentQuotePayload(
    _: ContractProvider,
    params: ProvideCurrentQuoteParams,
    value: bigint = toNano('0.3'),
  ) {
    const payload = beginCell().store(this.storeProvideCurrentQuoteParams(params)).endCell();
    return {
      to: this.address,
      value,
      body: payload,
    };
  }

  async getStorage(provider: ContractProvider): Promise<tgUSDStakingStorage> {
    const { state } = await provider.getState();
    if (state.type !== 'active' || !state.code || !state.data) {
      throw new Error('tgUSDStaking is not active');
    }
    const storageBoc = Cell.fromBoc(state.data)[0];
    if (!storageBoc) {
      throw new Error('tgUSDEngine is not initialized');
    }

    const storageSc = storageBoc.beginParse();
    const admin = storageSc.loadAddress();
    const nextAdmin = storageSc.loadMaybeAddress();
    const stakedManager = storageSc.loadAddress();
    const isHalt = storageSc.loadBoolean();
    const cooldownPeriod = storageSc.loadUintBig(TIMESTAMP_SIZE);

    const stakeInfoSlice = storageSc.loadRef().beginParse();
    const totalStaked = stakeInfoSlice.loadCoins();
    const totalSupply = stakeInfoSlice.loadCoins();
    const remainingStaked = stakeInfoSlice.loadCoins();
    const vestingReward = stakeInfoSlice.loadCoins();
    const vestingPeriod = stakeInfoSlice.loadUintBig(TIMESTAMP_SIZE);
    const vestingStart = stakeInfoSlice.loadUintBig(TIMESTAMP_SIZE);
    const lockedForUnstake = stakeInfoSlice.loadCoins();

    const jettonMastersInfoSlice = storageSc.loadRef().beginParse();
    const tgUSDJettonMaster = jettonMastersInfoSlice.loadAddress();
    const stgUSDJettonMaster = jettonMastersInfoSlice.loadAddress();

    const jettonWalletsInfoSlice = storageSc.loadRef().beginParse();
    const tgUSDJettonWallet = jettonWalletsInfoSlice.loadAddress();
    const stgUSDJettonWallet = jettonWalletsInfoSlice.loadAddress();

    const contractsCodeSlice = storageSc.loadRef().beginParse();
    const baseCode = contractsCodeSlice.loadRef();
    const unstakeAccountCode = contractsCodeSlice.loadRef();

    const storage: tgUSDStakingStorage = {
      admin,
      nextAdmin,
      stakedManager: stakedManager,
      isHalt,
      cooldownPeriod,
      vestingStart: vestingStart,
      totalStaked: totalStaked,
      totalShares: totalSupply,
      vestingReward: vestingReward,
      vestingPeriod,
      remainingStaked: remainingStaked,
      lockedForUnstake: lockedForUnstake,
      tgUSDJettonMaster,
      stgUSDJettonMaster,
      tgUSDJettonWallet,
      stgUSDJettonWallet,
      unstakeAccountCode,
      baseCode,
    };

    return storage;
  }

  async getUnstakeAccountAddress(provider: ContractProvider, unstaker: Address) {
    const result = await provider.get('unstakeAccount', [
      { type: 'slice', cell: beginCell().storeAddress(unstaker).endCell() },
    ]);
    return result.stack.readAddress();
  }

  async getConversionRatio(provider: ContractProvider): Promise<ConversionRatio> {
    const result = await provider.get('conversionRatio', []);
    const totalStakedWithUnvestedAmount = result.stack.readBigNumber();
    const totalShares = result.stack.readBigNumber();
    return { totalStakedWithUnvestedAmount, totalShares };
  }
}
