import { Posting } from '@domain/entities/posting.entity';

export interface PostingRepository {
  create(posting: Posting): Promise<Posting>;
  findById(id: string): Promise<Posting | null>;
  findByReference(reference: string): Promise<Posting | null>;
  findAll(): Promise<Posting[]>;
  findByAccountId(accountId: string): Promise<Posting[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Posting[]>;
  findLatest(): Promise<Posting | null>;
  exists(id: string): Promise<boolean>;
  existsByReference(reference: string): Promise<boolean>;
}
