import { Module } from "@nestjs/common";
// import { ConfigModule } from "@nestjs/config";
// import { MongooseModule } from "@nestjs/mongoose";
import { ExampleModule } from "./api/example.module";

@Module({
  imports: [
    // TODO: Add configuration module
    // ConfigModule.forRoot({ isGlobal: true }),

    // TODO: Add database module (MongoDB example)
    // MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/simple-ledger"),

    // TODO: Add feature modules
    ExampleModule,
  ],
})
export class AppModule {}
