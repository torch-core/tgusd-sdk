export abstract class Op {
  static readonly Engine = {
    DepositFP: 0x8e5adeb3,
    RequestRedeem: 0x14d600b6,
  };

  static readonly Staking = {
    StakeFp: 0xd4c3fdc0,
    UnstakeFp: 0x51656704,
    ProvideCurrentQuote: 0x984d8449,
  };

  static readonly Jetton = {
    Transfer: 0xf8a7ea5,
    Burn: 0x595f07bc,
  };

  static readonly RedeemAccount = {
    Claim: 0x66a8f123,
  };

  static readonly UnstakeAccount = {
    Withdraw: 0x4ca83dc8,
  };
}
