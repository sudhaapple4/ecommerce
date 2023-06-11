const express = require('express');
const { createUser, loginUser } = require('../controller/AuthController');
const router = express.Router();
console.log('auth ro=================')

router.post('/',createUser)
      .get('/',loginUser)


exports.router=router;