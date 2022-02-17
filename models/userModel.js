const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: 'default-icon.jpeg',
    },
    name: {
      type: String,
      required: [true, '用戶必須含有姓名'],
    },
    email: {
      type: String,
      required: [true, '用戶必須含有電郵地址'],
      unique: true,
      validate: [validator.isEmail, '請提供有效的電郵地址'],
    },
    password: {
      type: String,
      required: [true, '用戶必須含有密碼'],
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, '用戶必須確認密碼'],
      validate: [
        function (value) {
          value === this.password;
        },
        '輸入的確認密碼與密碼不符',
      ],
    },
    passwordChangedAt: {
      default: false,
      select: false,
    },
    // passwordResetToken: String,
    // passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate post
userSchema.virtual('post', {
  ref: 'Post',
  foreignField: 'creator',
  localField: '_id',
});

// Hash pw before storing to db
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Change passwordChangedAt timestamp when updating password
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Check whether user hv changed his pw
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      new Date(this.passwordChangedAt).getTime() / 1000
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

// Check whether pw is correct
userSchema.methods.correctPassword = async function (input, pw) {
  return await bcrypt.compare(input, pw);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
