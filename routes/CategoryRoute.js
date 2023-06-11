const express=require('express');
const { fetchCategory, createCategory } = require('../controller/CategoryController');
const router = express.Router();
router.get('/',fetchCategory)
      .post('/',createCategory);

exports.router=router;