import { Module } from "@nestjs/common";
import { ExampleController } from "./example.controller";
// import { ExampleService } from "../application/services/example.service";

@Module({
  imports: [
    // TODO: Add database modules, other feature modules
  ],
  controllers: [ExampleController],
  providers: [
    // ExampleService,
    // TODO: Add repository providers, other services
  ],
  exports: [
    // ExampleService,
    // TODO: Export services that other modules need
  ],
})
export class ExampleModule {}
