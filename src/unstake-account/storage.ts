import { Address } from '@ton/core';

export type UnstakeAccountStorage = {
  tgUSDStaking: Address;
  unstaker: Address;
  unstakedAmount: bigint;
  cooldownEnd: bigint;
  availableAmount: bigint;
};
