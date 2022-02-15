const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const router = express.Router();

const { getAllPosts, createPost, getPost, updatePost, deletePost } =
  postController;
const { protect } = authController;

router.route('/').get(protect, getAllPosts).post(createPost);
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);

module.exports = router;
