import { Injectable, Inject } from '@nestjs/common';
import { Posting } from '@domain/entities/posting.entity';
import { Entry, EntryType } from '@domain/entities/entry.entity';
import { Account } from '@domain/entities/account.entity';
import { PostingRepository } from '@domain/repositories/posting.repository.interface';
import { EntryRepository } from '@domain/repositories/entry.repository.interface';
import { AccountRepository } from '@domain/repositories/account.repository.interface';
import { Money } from '@shared/domain/value-objects/money';

export interface CreatePostingDto {
  entries: Array<{
    accountName: string;
    type: EntryType;
    amount: number;
    description: string;
    reference?: string;
  }>;
  reference: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PostingResultDto {
  id: string;
  reference: string;
  description: string;
  totalAmount: string;
  currency: string;
  entryCount: number;
  hash: string;
  createdAt: string;
}

@Injectable()
export class LedgerService {
  constructor(
    @Inject('PostingRepository')
    private readonly postingRepository: PostingRepository,
    @Inject('EntryRepository')
    private readonly entryRepository: EntryRepository,
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
  ) {}

  async createPosting(dto: CreatePostingDto): Promise<PostingResultDto> {
    await this.validateAccountsExist(dto.entries);
    const entries = await this.createEntries(dto.entries);
    const previousHash = await this.getPreviousHash();

    const posting = new Posting({
      entries,
      reference: dto.reference,
      description: dto.description,
      metadata: dto.metadata,
    });

    const savedPosting = await this.postingRepository.create(posting);

    for (const entry of entries) {
      await this.entryRepository.create(entry);
    }

    return {
      id: savedPosting.id,
      reference: savedPosting.reference,
      description: savedPosting.description,
      totalAmount: savedPosting.getTotalAmount().toString(),
      currency: savedPosting.entries[0].amount.currency,
      entryCount: savedPosting.entries.length,
      hash: savedPosting.hash,
      createdAt: savedPosting.createdAt.toISOString(),
    };
  }

  async getPostingByReference(reference: string): Promise<Posting> {
    const posting = await this.postingRepository.findByReference(reference);
    if (!posting) {
      throw new Error(`Posting with reference '${reference}' not found`);
    }
    return posting;
  }

  async getAllPostings(): Promise<Posting[]> {
    return await this.postingRepository.findAll();
  }

  async getPostingsForAccount(accountId: string): Promise<Posting[]> {
    return await this.postingRepository.findByAccountId(accountId);
  }

  async getEntriesForAccount(accountId: string): Promise<Entry[]> {
    return await this.entryRepository.findByAccountId(accountId);
  }

  private async validateAccountsExist(entries: CreatePostingDto['entries']): Promise<void> {
    for (const entry of entries) {
      const account = await this.accountRepository.findByName(entry.accountName);
      if (!account) {
        throw new Error(`Account with name '${entry.accountName}' not found`);
      }
    }
  }

  private async createEntries(entryDtos: CreatePostingDto['entries']): Promise<Entry[]> {
    const entries: Entry[] = [];

    for (const entryDto of entryDtos) {
      const account = await this.accountRepository.findByName(entryDto.accountName);
      if (!account) {
        throw new Error(`Account with name '${entryDto.accountName}' not found`);
      }

      const entry = new Entry({
        accountId: account.id,
        type: entryDto.type,
        amount: new Money(entryDto.amount, 'USD'),
        description: entryDto.description,
        reference: entryDto.reference,
        timestamp: new Date(),
      });

      entries.push(entry);
    }

    return entries;
  }

  private async getPreviousHash(): Promise<string> {
    const latestPosting = await this.postingRepository.findLatest();
    return latestPosting ? latestPosting.hash : undefined;
  }
}
