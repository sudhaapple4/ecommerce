const express=require('express');
const { createProduct } = require('../controller/ProductController');
const router = express.Router();

router.post('/',createProduct);

exports.router=router;