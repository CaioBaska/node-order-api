const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./orders.db'); 

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS "Order" (
      orderId TEXT PRIMARY KEY,
      value INTEGER NOT NULL,
      creationDate TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS Items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (orderId) REFERENCES "Order"(orderId) ON DELETE CASCADE
    )
  `);
});

module.exports = db;