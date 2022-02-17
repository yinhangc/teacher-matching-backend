const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

const { signup, login, updatePassword, protect } = authController;
const { updateMe, uploadUserPhoto, resizeUserPhoto, getMe } = userController;

router.post('/signup', signup);
router.post('/login', login);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe);
router.get('/getMe', protect, getMe);

module.exports = router;
