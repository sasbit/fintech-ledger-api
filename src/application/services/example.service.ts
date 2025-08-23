import { Injectable, Inject } from "@nestjs/common";
// import { IExampleRepository } from "../../domain/repositories/example.repository.interface";
// import { Example } from "../../domain/entities/example.entity";

@Injectable()
export class ExampleService {
  constructor() // private readonly exampleRepository: IExampleRepository, // @Inject("ExampleRepository")
  {}

  async create(data: any): Promise<any> {
    // TODO: Implement business logic
    // 1. Validate business rules
    // 2. Create domain entity
    // 3. Save via repository
    // 4. Return result
    throw new Error("Not implemented");
  }

  async findById(id: string): Promise<any> {
    // TODO: Implement business logic
    // 1. Validate input
    // 2. Fetch from repository
    // 3. Apply business logic if needed
    // 4. Return result
    throw new Error("Not implemented");
  }

  // TODO: Add more business methods
}
