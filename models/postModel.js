const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
  showPost: {
    type: Boolean,
    default: true,
  },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
