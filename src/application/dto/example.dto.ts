// Application layer DTOs for internal use between services

export class ExampleApplicationDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly amount: number,
    readonly createdAt: Date
  ) {}

  // TODO: Add methods for business logic transformations if needed

  static fromDomain(entity: any /* DomainEntity */): ExampleApplicationDto {
    // TODO: Transform domain entity to application DTO
    throw new Error("Not implemented");
  }

  toDomain(): any /* DomainEntity */ {
    // TODO: Transform application DTO to domain entity
    throw new Error("Not implemented");
  }
}
