import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountRepository } from '@domain/repositories/account.repository.interface';
import { Account, AccountType } from '@domain/entities/account.entity';
import { AccountDocument, AccountSchema } from '@infrastructure/schemas/account.schema';
import { Money } from '@shared/domain/value-objects/money';

@Injectable()
export class MongoAccountRepository implements AccountRepository {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>
  ) {}

  async create(account: Account): Promise<Account> {
    const accountData = {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: {
        amount: account.balance.amount,
        currency: account.balance.currency,
      },
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };

    const createdAccount = new this.accountModel(accountData);
    await createdAccount.save();

    return this.mapToDomain(createdAccount);
  }

  async findById(id: string): Promise<Account | null> {
    const accountDoc = await this.accountModel.findOne({ id }).exec();
    return accountDoc ? this.mapToDomain(accountDoc) : null;
  }

  async findByName(name: string): Promise<Account | null> {
    const accountDoc = await this.accountModel.findOne({ name }).exec();
    return accountDoc ? this.mapToDomain(accountDoc) : null;
  }

  async findAll(): Promise<Account[]> {
    const accountDocs = await this.accountModel.find().exec();
    return accountDocs.map(doc => this.mapToDomain(doc));
  }

  async findByType(type: AccountType): Promise<Account[]> {
    const accountDocs = await this.accountModel.find({ type }).exec();
    return accountDocs.map(doc => this.mapToDomain(doc));
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.accountModel.countDocuments({ id }).exec();
    return count > 0;
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.accountModel.countDocuments({ name }).exec();
    return count > 0;
  }

  private mapToDomain(accountDoc: AccountDocument): Account {
    return new Account(
      accountDoc.id,
      accountDoc.name,
      accountDoc.type as AccountType,
      new Money(accountDoc.balance.amount, accountDoc.balance.currency),
      accountDoc.createdAt,
      accountDoc.updatedAt
    );
  }
}
