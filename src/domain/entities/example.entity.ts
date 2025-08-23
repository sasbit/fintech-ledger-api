// Domain entities contain business logic and rules

export class ExampleEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly amount: number,
    readonly createdAt: Date = new Date()
  ) {
    // TODO: Add validation in constructor if needed
    this.validateBusinessRules();
  }

  static create(name: string, amount: number): ExampleEntity {
    // TODO: Implement entity creation logic
    // 1. Generate ID
    // 2. Validate inputs
    // 3. Apply business rules
    // 4. Return new entity
    throw new Error("Not implemented");
  }

  private validateBusinessRules(): void {
    // TODO: Implement business rule validation
    // Example: if (this.amount < 0) throw new Error("Amount cannot be negative");
    throw new Error("Not implemented");
  }

  // TODO: Add domain methods that contain business logic
  updateAmount(newAmount: number): ExampleEntity {
    // TODO: Implement business logic for updating
    // Return new instance (immutable approach)
    throw new Error("Not implemented");
  }

  // TODO: Add other business methods as needed
}
