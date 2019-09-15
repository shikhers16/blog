const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const auth = req.get('Authorization');
	if (!auth) {
		let error = new Error("Not Authenticated");
		error.statusCode = 401;
		throw error;
	}
	const token = auth.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, 'somesupersecretsecretid');
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	if (!decodedToken) {
		let error = new Error("Not Authenticated");
		error.statusCode = 401;
		throw error;
	}
	// console.log(decodedToken);
	req.userid = decodedToken.userID;
	next();
}