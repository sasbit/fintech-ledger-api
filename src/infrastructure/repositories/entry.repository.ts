import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntryRepository } from '@domain/repositories/entry.repository.interface';
import { Entry, EntryType } from '@domain/entities/entry.entity';
import { EntryDocument, EntrySchema, EntryMongoSchema } from '@infrastructure/schemas/entry.schema';
import { Money } from '@shared/domain/value-objects/money';

@Injectable()
export class MongoEntryRepository implements EntryRepository {
  constructor(
    @InjectModel(EntryMongoSchema.name) private entryModel: Model<EntryDocument>
  ) {}

  async create(entry: Entry): Promise<Entry> {
    const entryData = {
      id: entry.id,
      accountId: entry.accountId,
      type: entry.type,
      amount: {
        amount: entry.amount.amount,
        currency: entry.amount.currency,
      },
      description: entry.description,
      reference: entry.reference,
      timestamp: entry.timestamp,
      metadata: entry.metadata,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };

    const createdEntry = new this.entryModel(entryData);
    await createdEntry.save();

    return this.mapToDomain(createdEntry);
  }

  async findById(id: string): Promise<Entry | null> {
    const entryDoc = await this.entryModel.findOne({ id }).exec();
    return entryDoc ? this.mapToDomain(entryDoc) : null;
  }

  async findByAccountId(accountId: string): Promise<Entry[]> {
    const entryDocs = await this.entryModel.find({ accountId }).exec();
    return entryDocs.map(doc => this.mapToDomain(doc));
  }

  async findByType(type: EntryType): Promise<Entry[]> {
    const entryDocs = await this.entryModel.find({ type }).exec();
    return entryDocs.map(doc => this.mapToDomain(doc));
  }

  async findByReference(reference: string): Promise<Entry[]> {
    const entryDocs = await this.entryModel.find({ reference }).exec();
    return entryDocs.map(doc => this.mapToDomain(doc));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Entry[]> {
    const entryDocs = await this.entryModel.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();
    return entryDocs.map(doc => this.mapToDomain(doc));
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.entryModel.countDocuments({ id }).exec();
    return count > 0;
  }

  private mapToDomain(entryDoc: EntryDocument): Entry {
    return new Entry({
      id: entryDoc.id,
      accountId: entryDoc.accountId,
      type: entryDoc.type as EntryType,
      amount: new Money(entryDoc.amount.amount, entryDoc.amount.currency),
      description: entryDoc.description,
      reference: entryDoc.reference,
      timestamp: entryDoc.timestamp,
      metadata: entryDoc.metadata,
    });
  }
}
