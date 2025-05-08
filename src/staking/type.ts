import { Address, Cell } from '@ton/core';

export type StakeParams = {
  stakeAmount: bigint;
  queryId?: bigint;
  recipient?: Address;
};

export type ProvideCurrentQuoteParams = {
  queryId?: bigint;
  recipient?: Address;
  customPayload?: Cell;
};

export type ConversionRatio = {
  totalActiveStake: bigint;
  totalShares: bigint;
};
