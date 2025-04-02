export abstract class Op {
    static readonly Common = {
        Comment: 0,
        TopUp: 0xd372158c,
        Excess: 0xd53276db,
        Halt: 0xa8d19f57,
        Unhalt: 0xe2241ebe,
        Install: 0xe07784e5,
        ResetGas: 0x53a9192c,
        ChangeAdmin: 0x6501f354,
        ClaimAdmin: 0xfb88e119,
        ChangeJettonMasterAdmin: 0x7ba4e3ab,
        CallToJettonMaster: 0xadc0579b,
        CallTo: 0x235caf52,
        UpgradeContract: 0x2508d66a,
    };

    static readonly Engine = {
        DepositFP: 0x8e5adeb3,
        RequestRedeem: 0x14d600b6,
        RepaidFp: 0x9d3f2308,
        Payout: 0x4982ac34,
        UpdateRedeemWhitelistRoot: 0xa8521e02,
        AddCollateral: 0x35a68bb8,
        RemoveCollateral: 0xbb3b8494,
        AddCustodialWallet: 0x3bd09fd5,
        RemoveCustodialWallet: 0x3749d3e0,
        UpdateRedeemAccountCode: 0x20b7b119,
        UpgradeRedeemAccount: 0x14ced2ae,
        UpgradeJettonMaster: 0xe5661dc8,
        TransferRewardFp: 0x86b871c3,
        CancelRedeem: 0x12ea5122,
        ForceClaim: 0x5f6c09a6,
    };

    static readonly Staking = {
        StakeFp: 0xd4c3fdc0,
        UnstakeFp: 0x51656704,
        WithdrawInternal: 0xfa3ec18e,
        AllocateStaked: 0xe4692b7c,
        DeallocateStaked: 0x95663da,
        SupplyRewardFp: 0x5fe15c80,
        ProvideCurrentQuote: 0x984d8449,
        TakeCurrentQuote: 0x80ed6c2e,
        UpdateCooldownPeriod: 0xaa2eb3a8,
        UpdateVestingPeriod: 0xe9a09a01,
        UpdateUnstakeAccountCode: 0x658ce2c0,
        UpgradeUnstakeAccount: 0x240961d7,
        ForceWithdraw: 0xeb3a8986,
    };

    static readonly Jetton = {
        Transfer: 0xf8a7ea5,
        InternalTransfer: 0x178d4519,
        Notification: 0x7362d09c,
        ProvideWalletAddress: 0x2c76b973,
        TakeWalletAddress: 0xd1735400,
        BurnNotification: 0x7bdd97de,
        BurnExtraInfo: 0x85306c8c,
        Mint: 0x642b7d07,
        Burn: 0x595f07bc,
        SetStatus: 0xeed236d3,
    };

    static readonly RedeemAccount = {
        Claim: 0x66a8f123,
        RollbackClaim: 0xbb427118,
        ClaimSuccess: 0xde3c731b,
        CancelRedeemInternal: 0x618b047b,
    };

    static readonly UnstakeAccount = {
        Withdraw: 0x4ca83dc8,
        RollbackWihtdraw: 0x1fcaa449,
    };
}
