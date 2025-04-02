import { Address } from '@ton/core';
import { Asset } from '@torch-finance/core';

export type RedeemAccountStorage = {
  tgUSDEngine: Address;
  redeemer: Address;
  cooldownEnd: number;
  status: number;
  tgUSDBurnAmount: bigint;
  redeemAsset: Asset;
  redeemAmount: bigint;
  engineJettonWallet: Address;
};
