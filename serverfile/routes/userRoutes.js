const express = require('express');
const { registerController, authUser, allUser } = require('../controller/userController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();


//routes for user
router.route("/").post(registerController).get(protect, allUser);
router.post(`/login`, authUser);

module.exports = router;