import { Address, Cell, Dictionary } from '@ton/core';

export type tgUSDEngineStorage = {
  tgUSDJettonMaster: Address;
  tgUSDStaking: Address;
  isHalt: boolean;
  admin: Address;
  nextAdmin: Address | null;
  jettonMastersDict: Dictionary<Address, Address>;
  jettonWalletsBal: Dictionary<Address, bigint>;
  custodialWallets: Dictionary<Address, bigint>;
  signerKey: Buffer;
  redeemWhitelistRoot: bigint;
  baseCode: Cell;
  redeemAccountCode: Cell;
};
