import { Address } from '@ton/core';

export abstract class MockSettings {
  static readonly emulateBlockSeq = 29724017;
  static readonly sender = Address.parse('0QAHg-2Oy8Mc2BfENEaBcoDNXvHCu7mc28KkPIks8ZVqwmzg');
}

export abstract class ContractsAddress {
  static readonly tgUSDEngine = Address.parse('EQCJ_iTaGLlIwOR7X0wcza3ce31xJHgJWRtBJFOMtZXbQ2dK');
  static readonly tgUSD = Address.parse('EQB1knthy0pHn1IIupjJEBj-egruUa9SWQqH9-EEf8Mu3Poi');
  static readonly staking = Address.parse('EQCzFw5dyFMQruKMEOnLJosFrKPtQQst4SSQrviyuQzeEuun');
  static readonly stgUSD = Address.parse('EQAqZ2QiT0NQXTKe9YXZgfVvwtfCVNT6n0DagMiw6o2Uv4gW');
  static readonly USDT = Address.parse('kQBflht80hwbivqv3Hnlhigqfe4RdY4Kb-LSOVldvGBsArga');
  static readonly USDC = Address.parse('kQARxQlZfQUxhTcCRg4QraCtxmvw1GoGOeEanbcc55wLZrZO');
  static readonly redeemAccount = Address.parse('kQB7h6LCnPJQtddGpvaInjviUafgSxWJICr9YHuU9GsN2MMr');
  static readonly unstakeAccount = Address.parse('kQCfwbKz8_CUsLAbG0r-3soSSMmoXltzglkuHvZMsXcu1du9');
}
