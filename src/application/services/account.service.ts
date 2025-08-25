import { Injectable, Inject } from '@nestjs/common';
import { Account, AccountType } from '@domain/entities/account.entity';
import { AccountRepository } from '@domain/repositories/account.repository.interface';
import { EntryRepository } from '@domain/repositories/entry.repository.interface';
import { Money } from '@shared/domain/value-objects/money';

import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ description: 'Account name', example: 'Cash Account' })
  name: string;

  @ApiProperty({ description: 'Account type', enum: ['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE'], example: 'ASSET' })
  type: AccountType;

  @ApiProperty({ description: 'Initial balance', required: false, example: 1000 })
  initialBalance?: number;

  @ApiProperty({ description: 'Currency', required: false, default: 'USD', example: 'USD' })
  currency?: string;
}

export interface AccountBalanceDto {
  id: string;
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
}

@Injectable()
export class AccountService {
  constructor(
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
    @Inject('EntryRepository')
    private readonly entryRepository: EntryRepository
  ) {}

  async createAccount(dto: CreateAccountDto): Promise<Account> {
    const existingAccount = await this.accountRepository.findByName(dto.name);
    if (existingAccount) {
      throw new Error(`Account with name '${dto.name}' already exists`);
    }

    const initialBalance = new Money(
      dto.initialBalance || 0,
      dto.currency || 'USD'
    );

    const account = new Account(
      this.generateAccountId(),
      dto.name,
      dto.type,
      initialBalance,
      new Date(),
      new Date()
    );

    return await this.accountRepository.create(account);
  }

  async getAccount(id: string): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new Error(`Account with ID '${id}' not found`);
    }
    return account;
  }

  async getAccountBalance(id: string): Promise<AccountBalanceDto> {
    const account = await this.getAccount(id);
    
    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      currency: account.balance.currency,
    };
  }

  async getAccountEntries(id: string): Promise<any[]> {
    await this.getAccount(id);
    const entries = await this.entryRepository.findByAccountId(id);
    return entries;
  }

  async getAllAccounts(): Promise<Account[]> {
    return await this.accountRepository.findAll();
  }

  async getAccountsByType(type: AccountType): Promise<Account[]> {
    return await this.accountRepository.findByType(type);
  }

  async accountExists(id: string): Promise<boolean> {
    return await this.accountRepository.exists(id);
  }

  private generateAccountId(): string {
    return `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
