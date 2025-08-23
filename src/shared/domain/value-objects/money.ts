export class Money {
  constructor(
    readonly amount: number,
    readonly currency: string = "USD"
  ) {
    if (amount < 0) {
      throw new Error("Money amount cannot be negative");
    }
  }

  add(other: Money): Money {
    this.validateSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.validateSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  private validateSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot perform operation with different currencies: ${this.currency} vs ${other.currency}`
      );
    }
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }
}
