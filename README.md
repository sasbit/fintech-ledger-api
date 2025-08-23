# Double-Entry Ledger API

## Context

A Ledger is the core to every system which operates with money. From big banks to payments, defi businesses, a ledger is crucial to tracking money movements reliably. Essentially, a ledger is a glorified database which makes sure that all balances are correct at all times and money movement follows double entry bookkeeping standards.

You are tasked with building a simplified ledger while following clean architecture principles.

Some reads:

- https://en.wikipedia.org/wiki/Double-entry_bookkeeping
- https://stripe.com/blog/ledger-stripe-system-for-tracking-and-validating-money-movement
- https://en.wikipedia.org/wiki/Hash_chain

### Clean Architecture

We use a slightly more pragmatic version of the classic clean architecture principles. We split our code into the layers api, application, domain and infrastructure. This helps with centralising core business logic, enforces loose coupeling and reduces the risk of side effects on core processes to keep logic robust.

Layers:

- API: This includes strictly the API technlogy (GraphQL, REST, gRPC) only. Only service functions are allowed to be called in controllers.
- Application: This represents all use cases of the system. It orchestrates, domain functions, database access through repositories, adapters etc.
- Domain: Business Logic only. This includes the entities and define how one business entity should behave. This should be the single source of truth for e.g. status transitions, events firing.
- Infrastructure: Includes concrete implementations, e.g. DB access, 3rd party providers

## Challenge Overview

Build a **simplified ledger API** with:

- **Backend API**: NestJS with Clean Architecture
- **Ledger Postings**: Double-entry validated entries
- **Balance Tracking**: Real-time balance calculations per account

## Requirements

### 1. Backend Architecture (NestJS + Clean Architecture)

#### Modules Structure

Follow **Clean Architecture** with proper layer separation. You find the below folder structure as the scaffold for the project:

```
src/
  ├── api/
  │   ├── dto/                # API DTOs
  │   └── *.controller.ts/  # API controllers
  ├── application/
  │   ├── services/           # Services
  │   └── dto/                # Application DTOs
  ├── domain/
  │   ├── entities/           # Entities & Value Objects
  │   └── repositories/       # Repository interfaces
  ├── infrastructure/
  │   └── repositories/       # Repository implementations
  └── shared/
    └── domain/                 # Shared domain, e.g. Value Object for Money
```

### 2. Domain Model Design

**Core Entities & Value Objects**

_At least_, the following entities should be included:

- Posting
- Entry
- Account
- tbd

**Key Business Rules:**

- An account can be of type Liability, Asset, Income, Expense
- Each entry must affect exactly one account
- Entry must have either debitAmount OR creditAmount (not both)
- Each posting contains >= 2 entries
- Each posting must always fulfil the _Accounting Equation_
- Hash chain is used to validate posting integrity
- Upon a posting with a new account label, a new account is created automatically
- A posting contains metadata to store external ids

### 3. API Design

#### REST Endpoints

**Account API:**

```
POST   /api/v1/accounts                  # Create new account
GET    /api/v1/accounts/:id/balance      # Get current account balance
GET    /api/v1/accounts/:id/entries      # Get ledger entries for account
```

**Ledger API:**

```
POST   /api/v1/ledger/postings           # Create a new posting (double-entry)
GET    /api/v1/ledger/entries            # List all ledger entries (paginated)
GET    /api/v1/ledger/entries/:reference # Get entries by reference
```

#### Requirements:

- **OpenAPI/Swagger** documentation
- **Zod validation** for all inputs/outputs
- **Proper HTTP status codes** and error handling
- **Authentication** middleware (simple JWT or API key)
- **Rate limiting** and request throttling
- **Strongly consistent balance** https://en.wikipedia.org/wiki/Strong_consistency

### 4. Double-Entry Bookkeeping Requirements

#### Business Rules

Implement **proper double-entry bookkeeping** following [double-entry bookkeeping principles](https://en.wikipedia.org/wiki/Double-entry_bookkeeping):

**Core Accounting Principles:**

- Accounting Equation: Assets = Liabilities + Equity
- Every transaction must have equal debits and credits
- Each transaction must affect at least two accounts
- Entries are append-only meaning that it is impossible to update

**Account Types & Normal Balances:**

```typescript
enum AccountType {
  ASSET = "ASSET", // Normal debit balance
  LIABILITY = "LIABILITY", // Normal credit balance
  EQUITY = "EQUITY", // Normal credit balance
  REVENUE = "REVENUE", // Normal credit balance
  EXPENSE = "EXPENSE", // Normal debit balance
}

// Debit/Credit Rules:
// ASSETS & EXPENSES: Debit increases, Credit decreases
// LIABILITIES, EQUITY & REVENUE: Credit increases, Debit decreases
```

**Posting Structure:**

Each posting must contain:

- At least 2 journal entries (minimum 1 debit, 1 credit)
- Equal total debits and credits
- Reference to link related entries
- Description for audit trail

### 5. Hash Chaining for Data Integrity

#### Requirements

Implement **simple hash chaining** to ensure ledger integrity:

**Hash Chain Structure:**

- Each journal entry must contain a hash of the previous entry
- First entry has a predefined genesis hash
- Hash should include: previous hash + entry data + timestamp
- Use SHA-256 or similar cryptographic hash function

**Integrity Validation:**

- Verify hash chain is unbroken when retrieving entries
- Detect any tampering with historical records
- Generate new hash when creating entries

**Bonus (optional)**

- Run performance test using k6
- Implement mechanisms to make postings more performant

### 6. Domain Events (optional)

#### Simple Events

```typescript
// Core events
class PostingPosted extends DomainEvent
class ChainValidationFailed extends DomainEvent
class AccountBalanceUpdated extends DomainEvent
```

### 6. Database Design

#### Required Collections/Tables:

- `accounts` - Chart of accounts
- `postings` - Postings
- `entries` - Individual debit/credit entries with hash chain

#### Use either:

- **MongoDB** with Mongoose (matches your stack)
- **PostgreSQL** with TypeORM/Prisma
- **SQLite** for simplicity

### 7. Production Readiness

#### Observability:

- **Structured logging** (Winston/Pino)
- **Error tracking** and proper error responses

#### Configuration:

- **Environment-based config** (development/production)

#### Testing:

- **Unit tests** for domain logic
- **Integration tests** for API endpoints
- **E2E tests** for critical accounting flows

#### Docker Setup:

- **Multi-stage Dockerfile** for API
- **Docker Compose** for local development
- **Database** containerization with persistent volumes

## Deliverables

### 1. Working System

```
src/
  ├── api/
  │   ├── dto/                # API DTOs
  │   └── *.controller.ts/    # API controllers
  ├── application/
  │   ├── services/           # Services
  │   └── dto/                # Application DTOs
  ├── domain/
  │   ├── entities/           # Entities & Value Objects
  │   └── repositories/       # Repository interfaces
  ├── infrastructure/
  │   └── repositories/       # Repository implementations
  └── shared/
    └── domain/               # Shared domain, e.g. Value Object for Money
```

### 2. Documentation

- **README.md**: Setup instructions, API usage examples
- **Code comments** and inline documentation for accounting logic

### 3. Sample Data & Demo

- **Seed data**: Seeding script to simulate
- **Demo examples**: Simple double-entry postings (investment, sale, expense)
- **Test scenarios**: Validation failures, unbalanced entries

## Time Guidelines

**Total: 4-6 hours of focused work**

- **Hour 1**: Architecture design, NestJS project setup, domain modeling
- **Hours 2-3**: Core implementation (Account + Ledger modules with APIs)
- **Hour 4-6**: Testing, Docker setup, documentation

## Getting Started

1. Create the local setup with docker. It should be possible to run the thing with `docker compose up --build`
2. Check out the existing structure
3. Implement all details one process at a time
4. Make sure you are able to test this locally as soon as possible to validate every step

**Important: You can use any help you want, i.e. LLMs, Internet etc**

---

**Success Criteria:** We want to see if you can build production-ready, scalable software that follows enterprise patterns while implementing complex business logic. Focus on demonstrating software engineering excellence through proper domain modeling and clean architecture.
