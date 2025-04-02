import { Address, Cell } from '@ton/core';

export type tgUSDStakingStorage = {
  admin: Address;
  nextAdmin: Address | null;
  stakedManager: Address;
  isHalt: boolean;
  cooldownPeriod: bigint;
  vestingStart: bigint;
  totalStaked: bigint;
  totalShares: bigint;
  vestingReward: bigint;
  vestingPeriod: bigint;
  remainingStaked: bigint;
  lockedForUnstake: bigint;
  tgUSDJettonMaster: Address;
  stgUSDJettonMaster: Address;
  tgUSDJettonWallet: Address;
  stgUSDJettonWallet: Address;
  unstakeAccountCode: Cell;
  baseCode: Cell;
};
