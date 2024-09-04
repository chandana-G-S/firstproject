const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'newproject';

async function connectToDatabase() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectToDatabase();