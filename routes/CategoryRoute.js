const express=require('express');
const { createCategory, fetchCategories } = require('../controller/CategoryController');
const router = express.Router();
router.get('/',fetchCategories)
      .post('/',createCategory);

exports.router=router;