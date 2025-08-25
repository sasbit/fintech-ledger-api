export class Money {
  constructor(
    readonly amount: number,
    readonly currency: string = "USD"
  ) {
    this.validateAmount(amount);
    this.validateCurrency(currency);
  }

  private validateAmount(amount: number): void {
    if (!Number.isFinite(amount)) {
      throw new Error("Money amount must be a valid finite number");
    }

    if (amount < 0) {
      throw new Error("Money amount cannot be negative");
    }

    const decimalPlaces = this.getDecimalPlaces(amount);
    if (decimalPlaces > 4) {
      throw new Error("Money amount cannot have more than 4 decimal places");
    }

    if (amount > 999999999.9999) {
      throw new Error("Money amount is too large (max: 999,999,999.9999)");
    }
  }

  private validateCurrency(currency: string): void {
    if (!currency || typeof currency !== 'string' || currency.length !== 3) {
      throw new Error("Currency code must be exactly 3 characters");
    }

    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error("Currency code must be 3 uppercase letters");
    }
  }

  private getDecimalPlaces(num: number): number {
    if (Math.floor(num) === num) return 0;
    const str = num.toString();
    if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
      return str.split('.')[1].length;
    } else if (str.indexOf('e-') !== -1) {
      const match = str.match(/e-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
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

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }

  private validateSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot perform operation with different currencies: ${this.currency} vs ${other.currency}`
      );
    }
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
