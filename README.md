# Simple Ledger API

Double-entry accounting API with transaction validation, hash chaining, and JWT authentication. Enforces debits = credits and prevents data tampering.

## Quick Start

### Prerequisites
- Docker Desktop running

### Start System
```bash
git clone https://github.com/saschabittnerivy/simple-ledger
cd simple-ledger
docker compose up --build
```

**Services:**
- API: http://localhost:3000
- MongoDB: localhost:27017

## Test System

### Health Check
```bash
curl http://localhost:3000/health
```

### Sample Data
```bash
curl http://localhost:3000/api/v1/accounts
```

### Create Account
```bash
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bank",
    "type": "ASSET",
    "initialBalance": 5000
  }'
```

### Create Transaction
```bash
curl -X POST http://localhost:3000/api/v1/ledger/postings \
  -H "Content-Type: application/json" \
  -d '{
    "entries": [
      {"accountName": "Cash", "type": "DEBIT", "amount": 1000, "description": "Payment"},
      {"accountName": "Revenue", "type": "CREDIT", "amount": 1000, "description": "Income"}
    ],
    "reference": "DEMO-001",
    "description": "Demo transaction"
  }'
```

## Test API Using Swagger UI

### Access Swagger UI
Navigate to: http://localhost:3000/api/docs

### Authentication Setup
1. Expand "Authentication" section
2. Click "POST /api/v1/auth/login"
3. Click "Try it out"
4. Enter credentials:
   ```json
   {
     "username": "testuser",
     "password": "testpass"
   }
   ```
5. Click "Execute"
6. Copy `access_token` from response

### Test Endpoints

#### Account Management
1. Click lock icon 🔒 and enter token (Bearer + token)
2. **POST /api/v1/accounts** - Create account
3. **GET /api/v1/accounts** - List accounts
4. **GET /api/v1/accounts/{id}/balance** - Get balance
5. **GET /api/v1/accounts/{id}/entries** - Get entries

#### Ledger Operations
1. **POST /api/v1/ledger/postings** - Create transaction
2. **GET /api/v1/ledger/postings** - List transactions
3. **GET /api/v1/ledger/entries** - List entries
4. **GET /api/v1/ledger/entries/{reference}** - Get by reference

#### System Health
- **GET /health** - API status

### GET Endpoint Testing

#### Test Account Listing
1. **GET /api/v1/accounts**
   - Click "Try it out"
   - Click "Execute"
   - Verify response shows array of accounts
   - Check account structure: id, name, type, balance

#### Test Account Balance
1. **GET /api/v1/accounts/{id}/balance**
   - Replace {id} with actual account ID from step 1
   - Click "Try it out"
   - Click "Execute"
   - Verify response shows: id, name, type, balance, currency

#### Test Account Entries
1. **GET /api/v1/accounts/{id}/entries**
   - Replace {id} with actual account ID
   - Click "Try it out"
   - Click "Execute"
   - Verify response shows array of entries
   - Check entry structure: id, type, amount, description, timestamp

#### Test All Postings
1. **GET /api/v1/ledger/postings**
   - Click "Try it out"
   - Click "Execute"
   - Verify response shows array of postings
   - Check posting structure: id, reference, description, totalAmount, entryCount, hash, createdAt

#### Test All Entries
1. **GET /api/v1/ledger/entries**
   - Click "Try it out"
   - Click "Execute"
   - Verify response shows array of entries
   - Check entry structure: id, accountId, type, amount, description, reference, timestamp

#### Test Entries by Reference
1. **GET /api/v1/ledger/entries/{reference}**
   - Replace {reference} with actual transaction reference
   - Click "Try it out"
   - Click "Execute"
   - Verify response shows: reference, description, entries array
   - Check entries have correct accountId, type, amount

#### Test Health Check
1. **GET /health**
   - Click "Try it out"
   - Click "Execute"
   - Verify response shows: status, timestamp, service, version

### Expected Response Formats

#### Account Response
```json
{
  "success": true,
  "data": [
    {
      "id": "account_123",
      "name": "Cash",
      "type": "ASSET",
      "balance": "1000 USD"
    }
  ]
}
```

#### Balance Response
```json
{
  "success": true,
  "data": {
    "id": "account_123",
    "name": "Cash",
    "type": "ASSET",
    "balance": "1000 USD",
    "currency": "USD"
  }
}
```

#### Entries Response
```json
{
  "success": true,
  "data": [
    {
      "id": "entry_123",
      "type": "DEBIT",
      "amount": "500 USD",
      "description": "Payment",
      "timestamp": "2025-08-25T05:30:00.000Z"
    }
  ]
}
```

#### Postings Response
```json
{
  "success": true,
  "data": [
    {
      "id": "posting_123",
      "reference": "TXN-001",
      "description": "Transaction",
      "totalAmount": "1000",
      "entryCount": 2,
      "hash": "abc123...",
      "createdAt": "2025-08-25T05:30:00.000Z"
    }
  ]
}
```

### Test Data Examples

#### Create Account
```json
{
  "name": "Test Cash Account",
  "type": "ASSET",
  "initialBalance": 1000,
  "currency": "USD"
}
```

#### Create Transaction
```json
{
  "reference": "TEST_TXN",
  "description": "Test transaction",
  "entries": [
    {
      "accountName": "Test Cash Account",
      "type": "DEBIT",
      "amount": 500,
      "description": "Payment"
    },
    {
      "accountName": "Revenue",
      "type": "CREDIT",
      "amount": 500,
      "description": "Income"
    }
  ]
}
```

### Error Testing
- Create posting with 1 entry → 400 error
- Use non-existent account → 400 error
- Access without token → 401 error

### Alternative Testing
```bash
chmod +x test-api.sh
./test-api.sh
```

## Test Security Features

### Test 1: Try to Use a Fake Account
```bash
curl -X POST http://localhost:3000/api/v1/ledger/postings \
  -H "Content-Type: application/json" \
  -d '{
    "entries": [
      {"accountName": "FakeAccount", "type": "DEBIT", "amount": 100, "description": "Test"},
      {"accountName": "Revenue", "type": "CREDIT", "amount": 100, "description": "Test"}
    ],
    "reference": "SEC-001",
    "description": "Security test"
  }'
```
**Expected Result**: 400 error - "Account with name 'FakeAccount' not found"

### Test 2: Try to Create an Unbalanced Transaction
```bash
curl -X POST http://localhost:3000/api/v1/ledger/postings \
  -H "Content-Type: application/json" \
  -d '{
    "entries": [
      {"accountName": "Cash", "type": "DEBIT", "amount": 100, "description": "Test"},
      {"accountName": "Revenue", "type": "CREDIT", "amount": 50, "description": "Test"}
    ],
    "reference": "SEC-002",
    "description": "Unbalanced test"
  }'
```
**Expected Result**: 400 error - "Total debits must equal total credits"

## How It Works

### Double-Entry Accounting
- Total debits must equal total credits
- Minimum 2 entries per transaction
- Single currency per transaction

### Account Types
- ASSET: Debit increases, Credit decreases
- LIABILITY: Credit increases, Debit decreases  
- INCOME: Credit increases, Debit decreases
- EXPENSE: Debit increases, Credit decreases

### Data Protection
- SHA-256 hash for each transaction
- Hash changes if transaction is modified
- Prevents data tampering

### Authentication & Security
- JWT tokens required for all endpoints
- Rate limiting: 100 requests/minute
- Protected routes with Bearer authentication
- Token expiration: 24 hours

## API Endpoints

### Account Management
- `POST /api/v1/accounts` - Create account
- `GET /api/v1/accounts` - List all accounts
- `GET /api/v1/accounts/:id/balance` - Get account balance
- `GET /api/v1/accounts/:id/entries` - Get all entries for an account

### Ledger Operations
- `POST /api/v1/ledger/postings` - Record transaction
- `GET /api/v1/ledger/postings` - List all transactions
- `GET /api/v1/ledger/entries` - List all entries
- `GET /api/v1/ledger/entries/:reference` - Get transaction details

### Authentication
- `POST /api/v1/auth/login` - Login to get JWT token

### Documentation
- `GET /api/docs` - Interactive API documentation (Swagger UI)
- `GET /health` - Health check endpoint

## New Features & Capabilities

### 🔐 Authentication System
The API now requires authentication for all operations. Here's how to use it:

### API Documentation
- Swagger UI at `/api/docs`
- All endpoints documented with DTOs
- Authentication and error responses included
- Interactive testing interface

1. **Get a Token**: Use the login endpoint with any username/password (demo mode)
2. **Use the Token**: Include `Authorization: Bearer YOUR_TOKEN` in all requests
3. **Token Expiration**: Tokens are valid for 24 hours

### Account Entries
- Endpoint: `/api/v1/accounts/:id/entries`
- Returns all transactions for specified account
- Includes debit/credit history and timestamps

### Rate Limiting
- 100 requests per minute per client
- Applied to all endpoints
- Prevents API abuse

### Interactive Documentation
- Swagger UI at `/api/docs`
- Test endpoints directly in browser
- Complete API specification

## Troubleshooting

### If Containers Won't Start
```bash
docker compose down
docker system prune -f
docker compose up --build
```

### If Ports Are Busy
```bash
# Check what's using port 3000
lsof -ti:3000 | xargs kill -9

# Check what's using port 27017
docker stop $(docker ps -q --filter ancestor=mongo:7.0)
```

### Check System Status
```bash
docker compose ps
docker compose logs api
```

---

## Testing

1. Start API: `docker compose up --build`
2. Access Swagger UI: http://localhost:3000/api/docs
3. Follow testing instructions above

---

**Built with NestJS, MongoDB, Docker, Swagger UI**