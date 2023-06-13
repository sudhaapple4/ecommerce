const express = require('express');
const { fetchUserById, updateUser } = require('../controller/UserController');
const router = express.Router();

router.get('/own/:id',fetchUserById)
      .patch('/:id',updateUser)

exports.router= router;