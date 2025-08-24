import { Money } from '../../shared/domain/value-objects/money';

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

  /**
   * Check if this account can have a negative balance
   * Assets and Expenses can have negative balances (debits)
   * Liabilities and Income can have negative balances (credits)
   */
  canHaveNegativeBalance(): boolean {
    return this.type === AccountType.ASSET || 
           this.type === AccountType.EXPENSE ||
           this.type === AccountType.LIABILITY ||
           this.type === AccountType.INCOME;
  }

  /**
   * Get the normal balance side for this account type
   * Assets and Expenses: Debit (positive)
   * Liabilities and Income: Credit (negative)
   */
  getNormalBalanceSide(): 'DEBIT' | 'CREDIT' {
    switch (this.type) {
      case AccountType.ASSET:
      case AccountType.EXPENSE:
        return 'DEBIT';
      case AccountType.LIABILITY:
      case AccountType.INCOME:
        return 'CREDIT';
      default:
        throw new Error(`Unknown account type: ${this.type}`);
    }
  }

  /**
   * Check if the current balance is valid for this account type
   */
  isBalanceValid(): boolean {
    // For now, all accounts can have any balance
    // In a real system, you might have more complex validation rules
    return true;
  }

  /**
   * Create a new account with updated balance
   * This maintains immutability by returning a new instance
   */
  updateBalance(newBalance: Money): Account {
    return new Account(
      this.id,
      this.name,
      this.type,
      newBalance,
      this.createdAt,
      new Date() // Update timestamp
    );
  }

  /**
   * Create a new account with updated name
   */
  updateName(newName: string): Account {
    return new Account(
      this.id,
      newName,
      this.type,
      this.balance,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Check if this account is of a specific type
   */
  isType(type: AccountType): boolean {
    return this.type === type;
  }

  /**
   * Get a human-readable description of the account
   */
  getDescription(): string {
    return `${this.name} (${this.type}) - Balance: ${this.balance.toString()}`;
  }
}
