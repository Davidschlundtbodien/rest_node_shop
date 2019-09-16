const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Model Schema
const Product = require('../models/product.js');


// ROUTES

// INDEX
router.get('/', (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// CREATE
router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
      });
    })  
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

// SHOW
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({message: 'No valid entry found associatied with provided id'});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

// UPDATE
router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id}, {$set: updateOps})
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// DESTROY
router.delete('/:productId', (req, res, next) => {
  const id = req.params.productid;
  Product.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;