import { beginCell, OpenedContract, TonClient4 } from '@ton/ton';
import { tgUSDEngine } from '../src/engine';
import { tgUSDStaking } from '../src/staking';
import { RedeemAccount } from '../src/redeem-account';
import { UnstakeAccount } from '../src/unstake-account';
import { ContractsAddress, MockSettings } from './config';
import { SIGNATURE_SIZE } from '../src/common/Size';
import { Asset } from '@torch-finance/core';
describe('Wrapper Testcases', () => {
  const endpoint = 'https://testnet-v4.tonhubapi.com';
  const client = new TonClient4({ endpoint });
  let engine: OpenedContract<tgUSDEngine>;

  beforeEach(async () => {
    engine = client.open(tgUSDEngine.createFromAddress(ContractsAddress.tgUSDEngine));
  });

  describe('tgUSDEngine', () => {
    it('should get engine storage', async () => {
      const storage = await engine.getStorage();
      expect(storage).toBeDefined();
    });

    it('should get mint payload', async () => {
      const signature = Buffer.alloc(SIGNATURE_SIZE);
      const orderCell = beginCell().endCell();
      const payload = await engine.getMintPayload(MockSettings.sender, {
        signature,
        order: orderCell,
        collateralInfo: {
          collateralAsset: Asset.jetton(ContractsAddress.USDT),
          collateralAmount: 10000n,
        },
      });
      expect(payload).toBeDefined();
    });

    it('should get redeem payload', async () => {
      const signature = Buffer.alloc(SIGNATURE_SIZE);
      const orderCell = beginCell().endCell();
      const redeemWhitelistProof = beginCell().endCell();
      const redeemPayload = await engine.getRedeemPayload(MockSettings.sender, {
        signature,
        order: orderCell,
        collateralAsset: Asset.jetton(ContractsAddress.USDT),
        burnAmount: 10000n,
        redeemWhitelistProof,
      });
      expect(redeemPayload).toBeDefined();
    });
  });

  describe('RedeemAccount', () => {
    it('should get redeem account storage', async () => {
      const redeemAccount = client.open(RedeemAccount.createFromAddress(ContractsAddress.redeemAccount));
      const storage = await redeemAccount.getStorage();
      expect(storage).toBeDefined();
    });

    it('should get redeem account claim payload', async () => {
      const redeemAccount = client.open(RedeemAccount.createFromAddress(ContractsAddress.redeemAccount));
      const payload = await redeemAccount.getClaimPayload(MockSettings.sender);
      expect(payload).toBeDefined();
    });
  });

  describe('tgUSD Staking', () => {
    it('should get staking storage', async () => {
      const staking = client.open(tgUSDStaking.createFromAddress(ContractsAddress.staking, ContractsAddress.stgUSD));
      const storage = await staking.getStorage();
      expect(storage).toBeDefined();
    });

    it('should get stake payload', async () => {
      const staking = client.open(tgUSDStaking.createFromAddress(ContractsAddress.staking, ContractsAddress.stgUSD));
      const payload = await staking.getStakePayload(MockSettings.sender, {
        stakeAmount: 10000n,
      });
      expect(payload).toBeDefined();
    });

    it('should get unstake payload', async () => {
      const staking = client.open(tgUSDStaking.createFromAddress(ContractsAddress.staking, ContractsAddress.stgUSD));
      const payload = await staking.getUnstakePayload(MockSettings.sender, 10000n);
      expect(payload).toBeDefined();
    });

    it('should get provide current quote payload', async () => {
      const staking = client.open(tgUSDStaking.createFromAddress(ContractsAddress.staking, ContractsAddress.stgUSD));
      const payload = await staking.getProvideCurrentQuotePayload({});
      expect(payload).toBeDefined();
    });
  });

  describe('UnstakeAccount', () => {
    it('should get unstake account storage', async () => {
      const unstakeAccount = client.open(UnstakeAccount.createFromAddress(ContractsAddress.unstakeAccount));
      const storage = await unstakeAccount.getStorage();
      expect(storage).toBeDefined();
    });

    it('should get unstake account withdraw payload', async () => {
      const unstakeAccount = client.open(UnstakeAccount.createFromAddress(ContractsAddress.unstakeAccount));
      const payload = await unstakeAccount.getWithdrawPayload(MockSettings.sender);
      expect(payload).toBeDefined();
    });
  });
});
