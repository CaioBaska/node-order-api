const db = require('../config/db');

function transformOrderData(input) {
  return {
    orderId: input.numeroPedido,
    value: input.valorTotal,
    creationDate: new Date(input.dataCriacao).toISOString().slice(0, -1) + 'Z',
    items: input.items.map(item => ({
      productId: parseInt(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };
}

function createOrder(orderData, callback) {
  const transformed = transformOrderData(orderData);

  db.run(
    'INSERT INTO "Order" (orderId, value, creationDate) VALUES (?, ?, ?)',
    [transformed.orderId, transformed.value, transformed.creationDate],
    function (err) {
      if (err) return callback(err);

      const stmt = db.prepare(
        'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)'
      );

      transformed.items.forEach(item => {
        stmt.run(transformed.orderId, item.productId, item.quantity, item.price);
      });

      stmt.finalize();
      callback(null, transformed);
    }
  );
}

function getOrderById(orderId, callback) {
  db.get('SELECT * FROM "Order" WHERE orderId = ?', [orderId], (err, order) => {
    if (err || !order) return callback(err || new Error('getOrderById'));

    db.all(
      'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
      [orderId],
      (err, items) => {
        if (err) return callback(err);

        callback(null, { ...order, items });
      }
    );
  });
}

function listOrders(callback) {
  db.all('SELECT * FROM "Order"', (err, orders) => {
    if (err) return callback(err);

    const results = [];
    let count = 0;

    orders.forEach(order => {
      db.all(
        'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
        [order.orderId],
        (err, items) => {
          results.push({ ...order, items });

          if (++count === orders.length) callback(null, results);
        }
      );
    });

    if (orders.length === 0) callback(null, []);
  });
}

function updateOrder(orderId, updateData, callback) {
  const transformed = transformOrderData(updateData);

  db.run(
    'UPDATE "Order" SET value = ?, creationDate = ? WHERE orderId = ?',
    [transformed.value, transformed.creationDate, orderId],
    function (err) {
      if (err || this.changes === 0)
        return callback(err || new Error('updateOrder'));

      db.run('DELETE FROM Items WHERE orderId = ?', [orderId], err => {
        if (err) return callback(err);

        const stmt = db.prepare(
          'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)'
        );

        transformed.items.forEach(item => {
          stmt.run(orderId, item.productId, item.quantity, item.price);
        });

        stmt.finalize();
        callback(null, { orderId, ...transformed });
      });
    }
  );
}

function deleteOrder(orderId, callback) {
  db.run('DELETE FROM "Order" WHERE orderId = ?', [orderId], function (err) {
    if (err || this.changes === 0)
      return callback(err || new Error('deleteOrder'));

    callback(null);
  });
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder
};