import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
import { ExampleEntity } from "@domain/entities/example.entity";
import { IExampleRepository } from "@domain/repositories/example.repository.interface";

@Injectable()
export class ExampleRepository implements IExampleRepository {
  constructor() // private readonly model: Model<any>, // @InjectModel("ExampleModel")
  {}

  async save(entity: ExampleEntity): Promise<ExampleEntity> {
    // TODO: Implement database save
    // 1. Convert domain entity to database model
    // 2. Save to database
    // 3. Convert back to domain entity
    // 4. Return saved entity
    throw new Error("Not implemented");
  }

  async findById(id: string): Promise<ExampleEntity | null> {
    // TODO: Implement database query
    // 1. Query database by ID
    // 2. Convert database model to domain entity
    // 3. Return entity or null
    throw new Error("Not implemented");
  }

  async findAll(limit?: number, offset?: number): Promise<ExampleEntity[]> {
    // TODO: Implement database query with pagination
    throw new Error("Not implemented");
  }

  async delete(id: string): Promise<void> {
    // TODO: Implement database deletion
    throw new Error("Not implemented");
  }

  // TODO: Add private mapping methods
  // private toDomain(model: DatabaseModel): ExampleEntity { ... }
  // private toDatabase(entity: ExampleEntity): DatabaseModel { ... }
}
