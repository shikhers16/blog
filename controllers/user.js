const User = require('../models/user');

exports.getUser = async (req, res, next) => {
	const userid = req.params.userid;
	try {
		const user = await User.findById(userid);
		if (!user) {
			error = new Error(" User Not Found ");
			error.statusCode = 404;
			throw error;
		}
		return res.status(200).json({
			message: "User Found",
			user: user
		});
	}
	catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find();
		if (!users) {
			error = new Error(" Users Not Found ");
			error.statusCode = 404;
			throw error;
		}
		return res.status(200).json({
			message: "User Found",
			users: users
		});
	}
	catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.getStatus = async (req, res, next) => {
	let userid = req.query.user;
	if (!userid) {
		userid = req.userid;
	}
	try {
		console.log(userid);
		const user = await User.findById(userid);
		if (!user) {
			const error = new Error("User not found");
			error.statusCode = 404;
			throw error;
		}
		return res.status(200).json({
			message: 'Status Found',
			name: user.name,
			status: user.status
		});
	}
	catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.putStatus = async (req, res, next) => {
	const status = req.body.status;
	try {
		const user = await User.findById(req.userid);
		if (!user) {
			const error = new Error("User not found");
			error.statusCode = 404;
			throw error;
		}
		user.status = status;
		const result = await user.save();
		res.status(200).json({
			message: 'Status Found',
			status: result.status
		})
	}
	catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}