/** Database setup for BizTime. */

const { Client } = require("pg");

let DB_URI = 'postgresql://postgres:2728@localhost:5432/biztime';

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;