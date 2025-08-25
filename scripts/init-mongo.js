// MongoDB initialization script for Simple Ledger
// This script runs when the MongoDB container starts for the first time

print('Starting Simple Ledger database initialization...');

// Switch to the simple-ledger database
db = db.getSiblingDB('simple-ledger');

// Create collections with proper indexes
print('Creating collections and indexes...');

// Create accounts collection
db.createCollection('accounts');
db.accounts.createIndex({ "id": 1 }, { unique: true });
db.accounts.createIndex({ "name": 1 }, { unique: true });

// Create entries collection
db.createCollection('entries');
db.entries.createIndex({ "id": 1 }, { unique: true });
db.entries.createIndex({ "accountId": 1 });
db.entries.createIndex({ "reference": 1 });

// Create postings collection
db.createCollection('postings');
db.postings.createIndex({ "id": 1 }, { unique: true });
db.postings.createIndex({ "reference": 1 }, { unique: true });
db.postings.createIndex({ "hash": 1 }, { unique: true });

print('Collections and indexes created successfully!');

// Insert sample data for demonstration
print('Inserting sample data...');

// Sample Account: Cash
db.accounts.insertOne({
  id: "sample_cash_account",
  name: "Cash",
  type: "ASSET",
  balance: {
    amount: 10000,
    currency: "USD"
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Sample Account: Revenue
db.accounts.insertOne({
  id: "sample_revenue_account",
  name: "Revenue",
  type: "INCOME",
  balance: {
    amount: 0,
    currency: "USD"
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Sample Account: Expenses
db.accounts.insertOne({
  id: "sample_expenses_account",
  name: "Expenses",
  type: "EXPENSE",
  balance: {
    amount: 0,
    currency: "USD"
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Sample accounts created successfully!');

// Sample Posting: Initial Investment
const sampleEntries = [
  {
    id: "sample_entry_1",
    accountId: "sample_cash_account",
    type: "DEBIT",
    amount: {
      amount: 10000,
      currency: "USD"
    },
    description: "Initial investment received",
    reference: "INV-001",
    timestamp: new Date(),
    metadata: { source: "seed_data" }
  },
  {
    id: "sample_entry_2",
    accountId: "sample_revenue_account",
    type: "CREDIT",
    amount: {
      amount: 10000,
      currency: "USD"
    },
    description: "Initial investment received",
    reference: "INV-001",
    timestamp: new Date(),
    metadata: { source: "seed_data" }
  }
];

db.postings.insertOne({
  id: "sample_posting_1",
  entries: sampleEntries,
  reference: "INV-001",
  description: "Initial investment of $10,000",
  metadata: { source: "seed_data" },
  previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
  hash: "sample_hash_for_demo_purposes_only",
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Sample posting created successfully!');

print('Simple Ledger database initialization completed!');
print('Database: simple-ledger');
print('Collections: accounts, entries, postings');
print('Sample data: 3 accounts, 1 posting with 2 entries');
