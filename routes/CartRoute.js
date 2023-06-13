const express = require('express');
const { fetchBrands, createBrand } = require('../controller/BrandController');
const { addToCart, fetchCartByUser, updateCart, deleteFromCart } = require('../controller/CartController');
const router = express.Router();

router.post('/',addToCart)
      .get('/',fetchCartByUser)
      .patch('/:id',updateCart)
      .delete('/:id',deleteFromCart)
exports.router=router;