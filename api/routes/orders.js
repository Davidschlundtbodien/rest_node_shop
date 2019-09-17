const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order.js');
const Product = require('../models/product.js');

// Index
router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

// CREATE
router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'product not found'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json({
        message: 'Product not found',
        error: err
      });
    });
});

// SHOW
router.get('/:orderId', (req, res, next) => {
  Order.findbById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }
      res.status(200).json({
        order: order
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

// DESTROY
router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order removed'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;