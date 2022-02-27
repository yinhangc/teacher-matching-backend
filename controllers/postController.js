const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sharp = require('sharp');
const multer = require('multer');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');

// aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   secretKeyId: process.env.AWS_ACCESS_KEY_ID,
//   region: process.env.AWS_REGION,
// });

// const s3 = new aws.S3();

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let queryObj = { showPost: true };
  if (req.query.region)
    queryObj['region'] = { $in: req.query.region.split(',') };
  if (req.query.time) queryObj['time'] = { $in: req.query.time.split(',') };
  let limit = parseInt(req.query.limit) || 6;
  let page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const posts = await Post.find(queryObj).skip(skip).limit(limit);
  const postsTotal = await Post.count(queryObj);
  res.status(200).json({
    status: 'success',
    total: postsTotal,
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({ ...req.body, creator: req.user.id });
  res.status(201).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('刊登不存在', 404));
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  if (body.imageCover === 'null') body.imageCover = 'default-cover.jpeg';
  if (body.images === 'null') body.images = [];
  const post = await Post.findOneAndUpdate({ creator: req.user.id }, body, {
    runValidators: true,
    new: true,
  });
  if (!post) return next(new AppError('刊登不存在', 404));
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

const multerStorage = multer.memoryStorage();
const multerFilter = (_, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('上傳的格式必須為照片', 400), false);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPostImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 4 },
]);

exports.resizePostImages = catchAsync(async (req, _, next) => {
  if (!req.files.imageCover && !req.files.images) return next();
  const post = await Post.findOne({ creator: req.user.id }, 'id');
  if (req.files.imageCover) {
    req.body.imageCover = `post-${post.id}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/posts/${req.body.imageCover}`);
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `post-${post.id}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/posts/${filename}`);
        req.body.images.push(filename);
      })
    );
  }
  next();
});
