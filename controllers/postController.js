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
  const newPost = await Post.create({ ...req.body, creator: req.user._id });
  res.status(201).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('刊登不存在。', 404));
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findOneAndUpdate(
    { creator: req.user._id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!post) return next(new AppError('刊登不存在。', 404));
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});
