import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostingRepository } from '@domain/repositories/posting.repository.interface';
import { Posting } from '@domain/entities/posting.entity';
import { Entry, EntryType } from '@domain/entities/entry.entity';
import { Money } from '@shared/domain/value-objects/money';
import { PostingDocument } from '@infrastructure/schemas/posting.schema';

@Injectable()
export class MongoPostingRepository implements PostingRepository {
  constructor(
    @InjectModel(Posting.name) private postingModel: Model<PostingDocument>
  ) {}

  async create(posting: Posting): Promise<Posting> {
    const postingData = {
      id: posting.id,
      entries: posting.entries.map(entry => ({
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
      })),
      reference: posting.reference,
      description: posting.description,
      metadata: posting.metadata,
      previousHash: posting.previousHash,
      hash: posting.hash,
      createdAt: posting.createdAt,
      updatedAt: posting.updatedAt,
    };

    const createdPosting = new this.postingModel(postingData);
    await createdPosting.save();

    return this.mapToDomain(createdPosting, posting.entries);
  }

    async findById(id: string): Promise<Posting | null> {
    const postingDoc = await this.postingModel.findOne({ id }).exec();
    if (!postingDoc) return null;
    return this.mapToDomain(postingDoc, postingDoc.entries || []);
  }

  async findByReference(reference: string): Promise<Posting | null> {
    const postingDoc = await this.postingModel.findOne({ reference }).exec();
    if (!postingDoc) return null;

    return this.mapToDomain(postingDoc, postingDoc.entries || []);
  }

  async findAll(): Promise<Posting[]> {
    const postingDocs = await this.postingModel.find().exec();
    return postingDocs.map(doc => this.mapToDomain(doc, doc.entries || []));
  }

  async findByAccountId(accountId: string): Promise<Posting[]> {
    const postingDocs = await this.postingModel.find({
      'entries.accountId': accountId
    }).exec();
    return postingDocs.map(doc => this.mapToDomain(doc, doc.entries || []));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Posting[]> {
    const postingDocs = await this.postingModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();
    return postingDocs.map(doc => this.mapToDomain(doc, doc.entries || []));
  }

  async findLatest(): Promise<Posting | null> {
    const postingDoc = await this.postingModel
      .findOne()
      .sort({ createdAt: -1 })
      .exec();

    if (!postingDoc) return null;

    return this.mapToDomain(postingDoc, postingDoc.entries || []);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.postingModel.countDocuments({ id }).exec();
    return count > 0;
  }

  async existsByReference(reference: string): Promise<boolean> {
    const count = await this.postingModel.countDocuments({ reference }).exec();
    return count > 0;
  }

  private mapToDomain(postingDoc: PostingDocument, entries: any[]): Posting {
    const domainEntries = entries.map(entryData => new Entry({
      id: entryData.id,
      accountId: entryData.accountId,
      type: entryData.type as EntryType,
      amount: new Money(entryData.amount.amount, entryData.amount.currency),
      description: entryData.description,
      reference: entryData.reference,
      timestamp: entryData.timestamp || new Date(),
      metadata: entryData.metadata,
    }));

    return new Posting({
      id: postingDoc.id,
      entries: domainEntries,
      reference: postingDoc.reference,
      description: postingDoc.description,
      metadata: postingDoc.metadata,
    });
  }
}
