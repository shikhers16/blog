const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	posts: [{
		type: mongoose.Types.ObjectId,
		ref: 'Post'
	}]
});

module.exports = mongoose.model('User', userSchema);