import { randomUUID } from 'crypto';
import { Entry, EntryType } from './entry.entity';

export interface PostingProps {
  id?: string;
  entries: Entry[];
  reference: string;
  description: string;
  metadata?: Record<string, any>;
}

export class Posting {
  readonly id: string;
  readonly entries: Entry[];
  readonly reference: string;
  readonly description: string;
  readonly metadata: Record<string, any>;
  readonly previousHash: string;
  readonly hash: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: PostingProps) {
    this.validateEntries(props.entries);
    this.validateReference(props.reference);
    this.validateDescription(props.description);
    
    this.id = props.id || randomUUID();
    this.entries = props.entries;
    this.reference = props.reference;
    this.description = props.description;
    this.metadata = props.metadata || {};
    this.previousHash = this.getPreviousHash();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.hash = this.calculateHash();
  }

  private validateEntries(entries: Entry[]): void {
    if (!entries || entries.length < 2) {
      throw new Error('Posting must have at least 2 entries');
    }

    const totalDebits = entries
      .filter(entry => entry.type === EntryType.DEBIT)
      .reduce((sum, entry) => sum + entry.amount.amount, 0);

    const totalCredits = entries
      .filter(entry => entry.type === EntryType.CREDIT)
      .reduce((sum, entry) => sum + entry.amount.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new Error('Total debits must equal total credits');
    }

    const currencies = [...new Set(entries.map(entry => entry.amount.currency))];
    if (currencies.length > 1) {
      throw new Error('All entries must have the same currency');
    }
  }

  private validateReference(reference: string): void {
    if (!reference || typeof reference !== 'string') {
      throw new Error('Reference must be a non-empty string');
    }
    
    if (reference.length < 3) {
      throw new Error('Reference must be at least 3 characters long');
    }
    
    if (reference.length > 100) {
      throw new Error('Reference cannot exceed 100 characters');
    }
  }

  private validateDescription(description: string): void {
    if (!description || typeof description !== 'string') {
      throw new Error('Description must be a non-empty string');
    }
    
    if (description.length < 3) {
      throw new Error('Description must be at least 3 characters long');
    }
    
    if (description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }
  }

  private getPreviousHash(): string {
    return '0000000000000000000000000000000000000000000000000000000000000000';
  }

  private calculateHash(): string {
    const crypto = require('crypto');
    
    const data = {
      entries: this.entries.map(entry => ({
        accountId: entry.accountId,
        type: entry.type,
        amount: entry.amount.amount,
        description: entry.description,
        reference: entry.reference,
        timestamp: entry.timestamp,
      })),
      reference: this.reference,
      description: this.description,
      previousHash: this.previousHash,
      createdAt: this.createdAt,
    };

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data, Object.keys(data).sort()));
    
    return hash.digest('hex');
  }

  getTotalAmount(): number {
    return this.entries
      .filter(entry => entry.type === EntryType.DEBIT)
      .reduce((sum, entry) => sum + entry.amount.amount, 0);
  }

  getDebitEntries(): Entry[] {
    return this.entries.filter(entry => entry.type === EntryType.DEBIT);
  }

  getCreditEntries(): Entry[] {
    return this.entries.filter(entry => entry.type === EntryType.CREDIT);
  }

  toJSON() {
    return {
      id: this.id,
      entries: this.entries.map(entry => entry.toJSON()),
      reference: this.reference,
      description: this.description,
      metadata: this.metadata,
      previousHash: this.previousHash,
      hash: this.hash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
