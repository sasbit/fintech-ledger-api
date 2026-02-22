print('Starting ledger database initialization...');

db = db.getSiblingDB('ledger');

db.createCollection('accounts');
db.accounts.createIndex({ "id": 1 }, { unique: true });
db.accounts.createIndex({ "name": 1 }, { unique: true });

db.createCollection('entries');
db.entries.createIndex({ "id": 1 }, { unique: true });
db.entries.createIndex({ "accountId": 1 });
db.entries.createIndex({ "reference": 1 });

db.createCollection('postings');
db.postings.createIndex({ "id": 1 }, { unique: true });
db.postings.createIndex({ "reference": 1 }, { unique: true });
db.postings.createIndex({ "hash": 1 }, { unique: true });

print('Collections and indexes created successfully!');

print('Inserting sample data...');

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

print('Ledger database initialization completed!');
print('Database: ledger');
print('Collections: accounts, entries, postings');
print('Sample data: 3 accounts, 1 posting with 2 entries');
