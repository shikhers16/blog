const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// GET /feed/post/:postid
router.get('/post/:postid', isAuth, feedController.getPost);

// POST /feed/post
router.post('/post', isAuth, [
	body('title')
		.trim()
		.isString('title is not a string')
		.isLength({ min: 5 }, 'title is not a string'),
	body('content', 'Content is not a string or < 5 chars')
		.trim()
		.isString('content is not a string')
		.isLength({ min: 5 }, 'content is not a string')
], feedController.postPost);

// PUT /feed/post/:postid
router.put('/post/:postid', isAuth, [
	body('title')
		.trim()
		.isString('title is not a string')
		.isLength({ min: 5 }, 'title is not a string'),
	body('content', 'Content is not a string or < 5 chars')
		.trim()
		.isString('content is not a string')
		.isLength({ min: 5 }, 'content is not a string')
], feedController.putPost);

// DELETE /feed/post/:postid
router.delete('/post/:postid', isAuth, feedController.deletePost);


module.exports = router;