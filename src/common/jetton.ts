import { beginCell, Builder } from '@ton/core';
import { Address, Cell } from '@ton/core';
import { Maybe } from '@ton/core/dist/utils/maybe';
import { OPCODE_SIZE, QUERY_ID_SIZE, JETTON_WALLET_STATUS_SIZE } from './Size';
import { Op } from './Opcode';

export type JettonTransferParams = {
  queryId: bigint;
  amount: bigint;
  recipient: Address;
  responseDst: Address;
  customPayload?: Maybe<Cell>;
  forwardAmount?: bigint;
  forwardPayload?: Maybe<Cell>;
};

export type JettonBurnParams = {
  queryId: bigint;
  amount: bigint;
  responseDst?: Address;
  customPayload?: Maybe<Cell>;
};

export function storeJettonTransferMessage(params: JettonTransferParams): (builder: Builder) => void {
  return (builder: Builder) => {
    return builder
      .storeUint(Op.Jetton.Transfer, OPCODE_SIZE)
      .storeUint(params.queryId, QUERY_ID_SIZE)
      .storeCoins(params.amount)
      .storeAddress(params.recipient)
      .storeAddress(params.responseDst)
      .storeMaybeRef(params.customPayload ?? null)
      .storeCoins(params.forwardAmount ?? 0)
      .storeMaybeRef(params.forwardPayload ?? null)
      .endCell();
  };
}

export function storeJettonBurnMessage(params: JettonBurnParams): (builder: Builder) => void {
  return (builder: Builder) => {
    return builder
      .storeUint(Op.Jetton.Burn, OPCODE_SIZE)
      .storeUint(params.queryId, QUERY_ID_SIZE)
      .storeCoins(params.amount)
      .storeAddress(params.responseDst)
      .storeMaybeRef(params.customPayload ?? null)
      .endCell();
  };
}

export function packJettonWalletInit(ownerAddress: Address, jettonMasterAddress: Address): Cell {
  return beginCell()
    .storeUint(0, JETTON_WALLET_STATUS_SIZE)
    .storeCoins(0n)
    .storeAddress(ownerAddress)
    .storeAddress(jettonMasterAddress)
    .endCell();
}
