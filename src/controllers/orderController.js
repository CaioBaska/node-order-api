const orderModel = require('../models/orderModel');

exports.createOrder = (req, res) => {
  const orderData = req.body;
  if (!orderData.numeroPedido || !orderData.valorTotal || !orderData.dataCriacao || !Array.isArray(orderData.items)) {
    return res.status(400).json({ error: 'Dados inválidos: campos obrigatórios ausentes' });
  }
  orderModel.createOrder(orderData, (err, newOrder) => {
    if (err) return res.status(500).json({ error: 'Erro ao criar pedido: ' + err.message });
    res.status(201).json(newOrder);
  });
};

exports.getOrder = (req, res) => {
  const { orderId } = req.params;
  orderModel.getOrderById(orderId, (err, order) => {
    if (err) return res.status(404).json({ error: 'Pedido não encontrado: ' + err.message });
    res.status(200).json(order);
  });
};

exports.listOrders = (req, res) => {
  orderModel.listOrders((err, orders) => {
    if (err) return res.status(500).json({ error: 'Erro ao listar pedidos: ' + err.message });
    res.status(200).json(orders);
  });
};

exports.updateOrder = (req, res) => {
  const { orderId } = req.params;
  const updateData = req.body;
  if (!updateData.valorTotal || !updateData.dataCriacao || !Array.isArray(updateData.items)) {
    return res.status(400).json({ error: 'Dados inválidos para atualização' });
  }
  orderModel.updateOrder(orderId, { ...updateData, numeroPedido: orderId }, (err, updated) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar pedido: ' + err.message });
    res.status(200).json(updated);
  });
};

exports.deleteOrder = (req, res) => {
  const { orderId } = req.params;
  orderModel.deleteOrder(orderId, (err) => {
    if (err) return res.status(404).json({ error: 'Pedido não encontrado: ' + err.message });
    res.status(204).send();
  });
};