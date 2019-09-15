const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.putSignup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error(errors.array()[0].msg);
		error.statusCode = 422;
		throw error;
	}
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	let status = req.body.status;
	if (!status) {
		status = 'I am new'
	}
	return bcrypt.hash(password, 12)
		.then(hashedPassword => {
			const user = new User({
				email: email,
				password: hashedPassword,
				name: name,
				status: status
			});
			return user.save();
		})
		.then(result => {
			res.status(201)
				.json({
					message: "User Created",
					userId: result._id
				})
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				error = new Error(" User Not Found ");
				error.statusCode = 401;
				throw error;
			}
			loadedUser = user;
			return bcrypt.compare(password, user.password);
		})
		.then(isSame => {
			if (!isSame) {
				error = new Error("Email or Password is incorrect");
				error.statusCode = 401;
				throw error;
			}
			const token = jwt.sign({
				email: loadedUser.email,
				userID: loadedUser._id
			},
				'somesupersecretsecretid',
				{ expiresIn: '1h' });
			return res.status(200).json({ token: token, userId: loadedUser._id.toString() })
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}