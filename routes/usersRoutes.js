const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

const { signup, login, updatePassword, protect, updateMe } = authController;

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/updatePassword').patch(protect, updatePassword);
router.route('/updateMe').patch(protect, updateMe);

module.exports = router;
