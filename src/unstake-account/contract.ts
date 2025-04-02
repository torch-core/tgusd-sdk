import { Address, beginCell, Builder, Cell, Contract, ContractProvider, SenderArguments, toNano } from '@ton/core';
import { OPCODE_SIZE, QUERY_ID_SIZE, TIMESTAMP_SIZE } from '../common/Size';
import { Op } from '../common/Opcode';
import { UnstakeAccountStorage } from './storage';

export class UnstakeAccount implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new UnstakeAccount(address);
  }

  private storeWithdrawMessage(recipient?: Address, queryId: bigint = 0n) {
    return (builder: Builder) => {
      return builder
        .storeUint(Op.UnstakeAccount.Withdraw, OPCODE_SIZE)
        .storeUint(queryId, QUERY_ID_SIZE)
        .storeAddress(recipient)
        .endCell();
    };
  }

  async getWithdrawPayload(_: ContractProvider, recipient?: Address, queryId: bigint = 8n): Promise<SenderArguments> {
    const withdrawPayload = beginCell().store(this.storeWithdrawMessage(recipient, queryId)).endCell();
    return {
      to: this.address,
      value: toNano('0.2'),
      body: withdrawPayload,
    };
  }

  async getStorage(provider: ContractProvider): Promise<UnstakeAccountStorage> {
    const { state } = await provider.getState();
    if (state.type !== 'active' || !state.code || !state.data) {
      throw new Error('UnstakeAccount is not active');
    }

    const storageBoc = Cell.fromBoc(state.data)[0];
    if (!storageBoc) {
      throw new Error('UnstakeAccount is not initialized');
    }

    const storageSc = storageBoc.beginParse();
    const tgUSDStaking = storageSc.loadAddress();
    const unstaker = storageSc.loadAddress();
    const unstakeAmount = storageSc.loadCoins();
    const cooldownEnd = BigInt(storageSc.loadUint(TIMESTAMP_SIZE));
    const availableAmount = storageSc.loadCoins();
    const storage: UnstakeAccountStorage = {
      tgUSDStaking,
      unstaker,
      unstakedAmount: unstakeAmount,
      cooldownEnd,
      availableAmount,
    };

    return storage;
  }
}
