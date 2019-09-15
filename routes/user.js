const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// GET /auth/user/:userid
router.get('/user/:userid', userController.getUser);

// GET /auth/users
router.get('/users', userController.getUsers);

// GET /feed/status
router.get('/status', isAuth, userController.getStatus);

// PUT /feed/status
router.put('/status', isAuth, body('status').isString().not().isEmpty(), userController.putStatus);

module.exports = router;