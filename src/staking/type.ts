import { Address, Cell } from '@ton/core';

export type StakeParams = {
  queryId: bigint;
  stakeAmount: bigint;
  recipient?: Address;
};

export type ProvideCurrentQuoteParams = {
  queryId: bigint;
  recipient: Address;
  customPayload?: Cell;
};

export type ConversionRatio = {
  totalStakedWithUnvestedAmount: bigint;
  totalShares: bigint;
};
