import { Money } from '@shared/domain/value-objects/money';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class Account {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: AccountType,
    public readonly balance: Money,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateAccount();
  }

  private validateAccount(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Account ID is required');
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Account name is required');
    }

    if (!Object.values(AccountType).includes(this.type)) {
      throw new Error(`Invalid account type: ${this.type}`);
    }

    if (!this.balance) {
      throw new Error('Account balance is required');
    }
  }
}
