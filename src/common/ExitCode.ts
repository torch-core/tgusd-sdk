export abstract class ExitCodes {
  static readonly ERROR_WRONG_OP = 0xffff;
  static readonly ERROR_NON_POSITIVE_JETTON_AMOUNT = 1000;
  static readonly ERROR_NOT_SUPPORTED_JETTON_MASTER = 1003;
  static readonly ERROR_NOT_SUPPORTED_JETTON_WALLET = 1004;
  static readonly ERROR_INVALID_SIGNATURE = 1005;
  static readonly ERROR_ORDER_EXPIRED = 1008;
  static readonly ERROR_AMOUNT_MISMATCH = 1010;
  static readonly ERROR_NOT_EXOTIC_CELL = 1014;
  static readonly ERROR_NOT_MERKLE_PROOF = 1015;
  static readonly ERROR_INCORRECT_MERKLE_ROOT = 1016;
  static readonly ERROR_NOT_IN_REDEEM_WHITELIST = 1017;
  static readonly ERROR_NOT_REDEEMER = 1019;
  static readonly ERROR_COOLDOWN_NOT_PASSED = 1020;
  static readonly ERROR_NOT_ENOUGH_JETTON_BALANCE = 1022;
  static readonly ERROR_NOT_MINTER = 1024;
  static readonly ERROR_INVALID_ORDER_TYPE = 1025;
  static readonly ERROR_DUPLICATED_REDEEM = 1026;
  static readonly ERROR_NOT_ENOUGH_FEE = 1027;
  static readonly ERROR_INVALID_SHARE = 1028;
  static readonly ERROR_INVALID_UNSTAKED_AMOUNT = 1029;
  static readonly ERROR_NOT_UNSTAKE_ACCOUNT = 1031;
  static readonly ERROR_NOT_ENOUGH_STAKED = 1032;
  static readonly ERROR_NOT_UNSTAKER_OR_STAKING = 1033;
  static readonly ERROR_WRONG_COLLATERAL = 1043;
  static readonly ERROR_NOT_POSITIVE_WITHDRAW = 1046;
  static readonly ERROR_NOT_REDEEMER_OR_ENGINE = 1049;

  static explain(code: number): string {
    switch (code) {
      case this.ERROR_WRONG_OP:
        return 'Wrong operation';
      case this.ERROR_NON_POSITIVE_JETTON_AMOUNT:
        return 'Non-positive jetton amount';
      case this.ERROR_NOT_SUPPORTED_JETTON_MASTER:
        return 'Not supported jetton master';
      case this.ERROR_NOT_SUPPORTED_JETTON_WALLET:
        return 'Not supported jetton wallet';
      case this.ERROR_INVALID_SIGNATURE:
        return 'Invalid signature';
      case this.ERROR_ORDER_EXPIRED:
        return 'Order expired';
      case this.ERROR_AMOUNT_MISMATCH:
        return 'Amount mismatch';
      case this.ERROR_NOT_EXOTIC_CELL:
        return 'Not exotic cell';
      case this.ERROR_NOT_MERKLE_PROOF:
        return 'Not merkle proof';
      case this.ERROR_INCORRECT_MERKLE_ROOT:
        return 'Incorrect merkle root';
      case this.ERROR_NOT_IN_REDEEM_WHITELIST:
        return 'Not in redeem whitelist';
      case this.ERROR_NOT_REDEEMER:
        return 'Not redeemer';
      case this.ERROR_COOLDOWN_NOT_PASSED:
        return 'Cooldown not passed';
      case this.ERROR_NOT_ENOUGH_JETTON_BALANCE:
        return 'Not enough jetton balance';
      case this.ERROR_NOT_MINTER:
        return 'Not minter';
      case this.ERROR_INVALID_ORDER_TYPE:
        return 'Invalid order type';
      case this.ERROR_DUPLICATED_REDEEM:
        return 'Duplicated redeem';
      case this.ERROR_NOT_ENOUGH_FEE:
        return 'Not enough fee';
      case this.ERROR_INVALID_SHARE:
        return 'Invalid share';
      case this.ERROR_INVALID_UNSTAKED_AMOUNT:
        return 'Invalid unstaked amount';
      case this.ERROR_NOT_UNSTAKER_OR_STAKING:
        return 'Not unstaker or staking';
      case this.ERROR_WRONG_COLLATERAL:
        return 'Wrong collateral';
      case this.ERROR_NOT_POSITIVE_WITHDRAW:
        return 'Not positive withdraw';
      case this.ERROR_NOT_REDEEMER_OR_ENGINE:
        return 'Not redeemer or engine';
      default:
        return 'Unknown error';
    }
  }
}
