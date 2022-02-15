const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let queryObj = { showPost: true };
  if (req.query.region) {
    queryObj['region'] = { $in: req.query.region.split(',') };
  }
  if (req.query.time) {
    queryObj['time'] = { $in: req.query.time.split(',') };
  }
  const posts = await Post.find(queryObj);
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

exports.getPost = (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.updatePost = (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.deletePost = (req, res, next) => {
  res.status(204).json({
    status: 'success',
  });
};
