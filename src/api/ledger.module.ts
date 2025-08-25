import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerController } from './ledger.controller';
import { LedgerService } from '@application/services/ledger.service';
import { MongoPostingRepository } from '@infrastructure/repositories/posting.repository';
import { MongoEntryRepository } from '@infrastructure/repositories/entry.repository';
import { MongoAccountRepository } from '@infrastructure/repositories/account.repository';
import { Posting, PostingSchema } from '@infrastructure/schemas/posting.schema';
import { EntryMongoSchema, EntrySchema } from '@infrastructure/schemas/entry.schema';
import { Account, AccountSchema } from '@infrastructure/schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Posting.name, schema: PostingSchema },
                { name: EntryMongoSchema.name, schema: EntrySchema },
      { name: Account.name, schema: AccountSchema }
    ])
  ],
  controllers: [LedgerController],
  providers: [
    LedgerService,
    {
      provide: 'PostingRepository',
      useClass: MongoPostingRepository,
    },
    {
      provide: 'EntryRepository',
      useClass: MongoEntryRepository,
    },
    {
      provide: 'AccountRepository',
      useClass: MongoAccountRepository,
    },
  ],
  exports: [LedgerService],
})
export class LedgerModule {}
