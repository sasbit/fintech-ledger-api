import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "@database/database.module";
import { AccountModule } from "./api/account.module";
import { LedgerModule } from "./api/ledger.module";
import { AuthModule } from "./api/auth.module";
import { HealthController } from "./health.controller";
import configuration from "@config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 100, 
    }]),
    DatabaseModule,
    AccountModule,
    LedgerModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
