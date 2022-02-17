const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const router = express.Router();

const {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  uploadPostImages,
  resizePostImages,
} = postController;
const { protect } = authController;

router
  .route('/')
  .get(getAllPosts)
  .post(protect, createPost)
  .patch(protect, uploadPostImages, resizePostImages, updatePost);
router.get('/:id', getPost);

module.exports = router;
