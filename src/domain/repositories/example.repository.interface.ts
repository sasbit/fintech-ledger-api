import { ExampleEntity } from "@domain/entities/example.entity";

// Repository interfaces define data access contracts for the domain

export interface IExampleRepository {
  save(entity: ExampleEntity): Promise<ExampleEntity>;
  findById(id: string): Promise<ExampleEntity | null>;
  findAll(limit?: number, offset?: number): Promise<ExampleEntity[]>;
  delete(id: string): Promise<void>;

  // TODO: Add domain-specific query methods
  // Example: findByName(name: string): Promise<ExampleEntity[]>;
  // Example: findByAmountRange(min: number, max: number): Promise<ExampleEntity[]>;
}
