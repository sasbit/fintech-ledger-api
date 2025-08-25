import { Entry, EntryType } from '@domain/entities/entry.entity';

export interface EntryRepository {
  create(entry: Entry): Promise<Entry>;
  findById(id: string): Promise<Entry | null>;
  findByAccountId(accountId: string): Promise<Entry[]>;
  findByType(type: EntryType): Promise<Entry[]>;
  findByReference(reference: string): Promise<Entry[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Entry[]>;
  exists(id: string): Promise<boolean>;
}
