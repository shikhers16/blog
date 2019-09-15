const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

const POSTS_PER_PAGE = 3;

exports.getPosts = (req, res, next) => {
	const currentPage = req.query.page || 1;
	let totalItems;
	Post.find()
		.countDocuments()
		.then(numPosts => {
			totalItems = numPosts;
			return Post.find()
				.populate('creator').
				sort({ createdAt: -1 })
				.skip((currentPage - 1) * POSTS_PER_PAGE)
				.limit(POSTS_PER_PAGE)
		})
		.then(posts => {
			let nextPage = null;
			if (totalItems > POSTS_PER_PAGE * currentPage) {
				nextPage = +currentPage + 1
			}
			res.status(200).json({
				message: 'Posts fetched',
				posts: posts,
				totalItems: totalItems,
				nextPage: nextPage
			}
			)
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}

exports.getPost = (req, res, next) => {
	const postid = req.params.postid;
	Post.findById(postid)
		.populate('creator')
		.then(post => {
			if (!post) {
				const error = new Error("Post not found");
				error.statusCode = 404;
				throw error;
			}
			return res.status(200).json({ message: 'Post fetched', post: post });
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}

exports.postPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error(errors.array()[0].msg);
		error.statusCode = 422;
		throw error;
	}
	// let imageUrl = null;
	let imageUrl = req.body.image;
	if (req.file) {
		imageUrl = req.file.path;
	}
	const title = req.body.title;
	const content = req.body.content;
	//create in db
	console.log('user', req.userid);
	const post = new Post({
		title: title,
		imageUrl: imageUrl,
		content: content,
		creator: req.userid
	});
	post
		.save()
		.then(result => {
			return User.findById(req.userid);
		})
		.then(user => {
			console.log(user);
			user.posts.push(post);
			return user.save();
		})
		.then(result => {
			return res.status(201).json({
				message: 'post created succesfully',
				post: post
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}

exports.putPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation Failed, entered data is incorrect');
		error.statusCode = 422;
		throw error;
	}
	const postid = req.params.postid;
	const title = req.body.title;
	const content = req.body.content;
	let imageUrl = req.body.image;
	if (req.file) {
		imageUrl = req.file.path;
	}
	//create in db
	Post.findById(postid)
		.then(post => {
			if (!post) {
				const error = new Error("Post not found");
				error.statusCode = 404;
				throw error;
			}
			if (post.creator.toString() !== req.userid.toString()) {
				const error = new Error("Not Authorized to edit this post");
				error.statusCode = 401;
				throw error;
			}
			if (imageUrl !== post.imageUrl) {
				clearImage(post.imageUrl);
			}
			post.title = title;
			post.content = content;
			post.imageUrl = imageUrl;
			return post.save();
		})
		.then(result => {
			console.log(result);
			return res.status(200).json({
				message: 'post updated succesfully',
				post: result
			})
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}

exports.deletePost = (req, res, next) => {
	const postid = req.params.postid;
	Post.findById(postid)
		.then(post => {
			if (!post) {
				const error = new Error("Post not found");
				error.statusCode = 404;
				throw error;
			}
			if (post.creator.toString() !== req.userid.toString()) {
				const error = new Error("Not Authorized to delete this post");
				error.statusCode = 401;
				throw error;
			}
			//Check logged in user
			clearImage(post.imageUrl);
			return Post.findByIdAndRemove(postid);
		})
		.then(result => {
			return User.findById(req.userid);
		})
		.then(user => {
			console.log(user.posts, postid);
			user.posts.pull(postid);
			return user.save();
		})
		.then(result => {
			return res.status(200).json({
				message: 'post deleted succesfully',
				post: result
			})
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});

}

const clearImage = filePath => {
	if (filePath) {
		filePath = path.join(__dirname, '..', filePath);
		//fs.unlink(filePath, err => console.log(err));
	}
}