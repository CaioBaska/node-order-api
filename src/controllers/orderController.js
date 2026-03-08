const orderService = require('../services/orderService');

exports.createOrder = (req, res) => {
  const orderData = req.body;

  if (!orderData.numeroPedido || !orderData.valorTotal || !orderData.dataCriacao || !Array.isArray(orderData.items)) {
    return res.status(400).json({ error: 'Invalid Data: Required fields missing' });
  }

  orderService.createOrder(orderData, (err, newOrder) => {
    if (err) return res.status(500).json({ error: 'Error creating order: ' + err.message });

    res.status(201).json(newOrder);
  });
};

exports.getOrder = (req, res) => {
  const { orderId } = req.params;

  orderService.getOrder(orderId, (err, order) => {
    if (err) return res.status(404).json({ error: 'Order Not Found: ' + err.message });

    res.status(200).json(order);
  });
};

exports.listOrders = (req, res) => {
  orderService.listOrders((err, orders) => {
    if (err) return res.status(500).json({ error: 'Error listing orders: ' + err.message });

    res.status(200).json(orders);
  });
};

exports.updateOrder = (req, res) => {
  const { orderId } = req.params;
  const updateData = req.body;

  if (!updateData.valorTotal || !updateData.dataCriacao || !Array.isArray(updateData.items)) {
    return res.status(400).json({ error: 'Invalid Data for Update' });
  }

  orderService.updateOrder(orderId, updateData, (err, updated) => {
    if (err) return res.status(500).json({ error: 'Error updating order: ' + err.message });

    res.status(200).json(updated);
  });
};

exports.deleteOrder = (req, res) => {
  const { orderId } = req.params;

  orderService.deleteOrder(orderId, (err) => {
    if (err) return res.status(404).json({ error: 'Order Not Found: ' + err.message });

    res.status(204).send();
  });
};