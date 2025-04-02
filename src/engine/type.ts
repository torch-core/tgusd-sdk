import { Address, Cell } from '@ton/core';
import { Asset } from '@torch-finance/core';

export type CollateralInfo = {
  collateralAsset: Asset;
  collateralAmount: bigint;
};

export type MintOrderParams = {
  queryId: bigint;
  signature: Buffer;
  order: Cell;
  collateralInfo: CollateralInfo;
  recipient?: Address;
};

export type RedeemOrderParams = {
  queryId: bigint;
  signature: Buffer;
  order: Cell;
  collateralAsset: Asset;
  burnAmount: bigint;
  redeemWhitelistProof: Cell;
};
