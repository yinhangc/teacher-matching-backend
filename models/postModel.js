const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '刊登必須含有作者'],
    unique: true,
  },
  imageCover: {
    type: String,
  },
  images: {
    type: [String],
  },
  title: {
    type: String,
    required: [true, '刊登必須含有標題'],
    maxlength: [100, '標題必須不多於100字'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, '刊登必須含有聯絡電話'],
    trim: true,
  },
  region: {
    type: [String],
    required: true,
    validate: [(arr) => arr.length > 0, '刊登必須含有地區'],
  },
  time: {
    type: [String],
    required: true,
    validate: [(arr) => arr.length > 0, '刊登必須含有時間'],
  },
  description: {
    type: String,
    required: [true, '刊登必須含有描述'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  showPost: {
    type: Boolean,
    default: true,
  },
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    select: 'name icon',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
