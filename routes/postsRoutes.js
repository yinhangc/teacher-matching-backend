const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const router = express.Router();

const { getAllPosts, createPost, getPost, updatePost } = postController;
const { protect } = authController;

router
  .route('/')
  .get(getAllPosts)
  .post(protect, createPost)
  .patch(protect, updatePost);
router.get('/:id', getPost);

module.exports = router;
