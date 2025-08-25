import { randomUUID } from 'crypto';
import { Money } from '@shared/domain/value-objects/money';

export enum EntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export interface EntryProps {
  id?: string;
  accountId: string;
  type: EntryType;
  amount: Money;
  description: string;
  reference?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export class Entry {
  readonly id: string;
  readonly accountId: string;
  readonly type: EntryType;
  readonly amount: Money;
  readonly description: string;
  readonly reference?: string;
  readonly timestamp?: Date;
  readonly metadata: Record<string, any>;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: EntryProps) {
    this.id = props.id || randomUUID();
    this.accountId = props.accountId;
    this.type = props.type;
    this.amount = props.amount;
    this.description = props.description;
    this.reference = props.reference;
    this.timestamp = props.timestamp || new Date();
    this.metadata = props.metadata || {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
    
    this.validateEntry();
  }

  private validateEntry(): void {
    if (!this.accountId || this.accountId.trim().length === 0) {
      throw new Error('Account ID is required');
    }

    if (!this.type || !Object.values(EntryType).includes(this.type)) {
      throw new Error('Valid entry type (DEBIT or CREDIT) is required');
    }

    if (!this.amount || this.amount.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Description is required');
    }

    if (this.description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }

    if (this.reference && this.reference.length > 100) {
      throw new Error('Reference cannot exceed 100 characters');
    }
  }

  isDebit(): boolean {
    return this.type === EntryType.DEBIT;
  }

  isCredit(): boolean {
    return this.type === EntryType.CREDIT;
  }

  toJSON() {
    return {
      id: this.id,
      accountId: this.accountId,
      type: this.type,
      amount: this.amount.toJSON(),
      description: this.description,
      reference: this.reference,
      timestamp: this.timestamp,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
