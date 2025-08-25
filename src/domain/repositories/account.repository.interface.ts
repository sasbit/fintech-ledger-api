import { Account, AccountType } from '@domain/entities/account.entity';

export interface AccountRepository {
  create(account: Account): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findByName(name: string): Promise<Account | null>;
  findAll(): Promise<Account[]>;
  findByType(type: AccountType): Promise<Account[]>;
  exists(id: string): Promise<boolean>;
  existsByName(name: string): Promise<boolean>;
}
