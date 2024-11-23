const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostsByAuthor, updatePost, deletePost } = require('../controllers/postController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/post').post(isAuthenticatedUser, createPost);
router.route('/posts').get(getAllPosts);
router.route('/posts/author').get(getPostsByAuthor); // Changed route to avoid conflict
router.route('/post/:id').put(isAuthenticatedUser, updatePost);
router.route('/post/:id').delete(isAuthenticatedUser, deletePost);

module.exports = router;