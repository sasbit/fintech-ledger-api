import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from './account.controller';
import { AccountService } from '@application/services/account.service';
import { MongoAccountRepository } from '@infrastructure/repositories/account.repository';
import { MongoEntryRepository } from '@infrastructure/repositories/entry.repository';
import { Account, AccountSchema } from '@infrastructure/schemas/account.schema';
import { EntryMongoSchema, EntrySchema } from '@infrastructure/schemas/entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: EntryMongoSchema.name, schema: EntrySchema }
    ])
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: 'AccountRepository',
      useClass: MongoAccountRepository,
    },
    {
      provide: 'EntryRepository',
      useClass: MongoEntryRepository,
    },
  ],
  exports: [AccountService],
})
export class AccountModule {}
