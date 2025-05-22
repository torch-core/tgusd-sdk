import { Address } from '@ton/core';
import { Asset } from '@torch-finance/core';

export abstract class RedeemAccountStatus {
  static Available = 0;
  static Pending = 1;
  static Processing = 2;
}

export type RedeemAccountStorage = {
  tgUSDEngine: Address;
  redeemer: Address;
  cooldownEnd: number;
  status: RedeemAccountStatus;
  tgUSDBurnAmount: bigint;
  redeemAsset: Asset;
  redeemAmount: bigint;
  engineJettonWallet: Address;
};
