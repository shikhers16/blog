const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');
const authController = require('../controllers/auth');

// PUT /auth/signup
router.put('/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email')
			.normalizeEmail()
			.custom((value, { req }) => {
				return User.findOne({
					email: value
				})
					.then(userDoc => {
						if (userDoc) {
							return Promise.reject('Email already exists, please login or use a different email')
						}
					})
			}),
		body('password')
			.isString()
			.isLength({ min: 5 }, 'password should be aleast 5 chars long'),
		body('name')
			.trim()
			.isString()
	],
	authController.putSignup);

// POST /auth/login
router.post('/login', authController.postLogin);

module.exports = router;