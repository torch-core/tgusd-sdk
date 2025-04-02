import { Address, beginCell, Builder, Cell, Contract, ContractProvider, SenderArguments, toNano } from '@ton/core';
import { Asset } from '@torch-finance/core';
import { OPCODE_SIZE, QUERY_ID_SIZE, REDEEM_ACCOUNT_STATUS_SIZE, TIMESTAMP_SIZE } from '../common/Size';
import { Op } from '../common/Opcode';
import { RedeemAccountStorage } from './storage';

export class RedeemAccount implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new RedeemAccount(address);
  }

  private storeClaimMessage(recipient?: Address, queryId: bigint = 0n) {
    return (builder: Builder) => {
      return builder
        .storeUint(Op.RedeemAccount.Claim, OPCODE_SIZE)
        .storeUint(queryId, QUERY_ID_SIZE)
        .storeAddress(recipient)
        .endCell();
    };
  }

  async getClaimPayload(_: ContractProvider, recipient?: Address, queryId: bigint = 0n): Promise<SenderArguments> {
    const claimPayload = beginCell().store(this.storeClaimMessage(recipient, queryId)).endCell();
    return {
      to: this.address,
      value: toNano('0.2'),
      body: claimPayload,
    };
  }

  async getStorage(provider: ContractProvider): Promise<RedeemAccountStorage> {
    const { state } = await provider.getState();
    if (state.type !== 'active' || !state.code || !state.data) {
      throw new Error('RedeemAccount is not active');
    }

    const storageBoc = Cell.fromBoc(state.data)[0];
    if (!storageBoc) {
      throw new Error('RedeemAccount is not initialized');
    }

    const storageSc = storageBoc.beginParse();
    const tgUSDEngine = storageSc.loadAddress();
    const redeemer = storageSc.loadAddress();
    const cooldownEnd = storageSc.loadUint(TIMESTAMP_SIZE);
    const status = storageSc.loadUint(REDEEM_ACCOUNT_STATUS_SIZE);
    const redeemPayloadSlice = storageSc.loadRef().beginParse();
    const redeemAsset = Asset.fromCell(redeemPayloadSlice.loadRef());
    const redeemAmount = redeemPayloadSlice.loadCoins();
    const engineJettonWallet = redeemPayloadSlice.loadAddress();
    const tgUSDBurnAmount = redeemPayloadSlice.loadCoins();
    const storage: RedeemAccountStorage = {
      tgUSDEngine,
      redeemer,
      cooldownEnd,
      status,
      redeemAsset,
      redeemAmount,
      engineJettonWallet,
      tgUSDBurnAmount,
    };

    return storage;
  }
}
