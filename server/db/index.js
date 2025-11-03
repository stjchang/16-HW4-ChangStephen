require('dotenv').config();

let DatabaseManager;

if (process.env.DB_TYPE === 'mongodb') {
    DatabaseManager = require('./mongodb');
} else if (process.env.DB_TYPE === 'postgresql') {
    DatabaseManager = require('./postgresql');
} else {
    throw new Error(`unsupported database type, must be mongodb or postgresql`);
}

module.exports = DatabaseManager;