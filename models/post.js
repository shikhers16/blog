const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	imageUrl: String,
	content: {
		type: String,
		required: true
	},
	creator: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);