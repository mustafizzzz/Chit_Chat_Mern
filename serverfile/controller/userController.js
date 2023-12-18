const asyncHandler = require('express-async-handler');
const User = require('../models/userModal');
const generateToken = require('../config/generateToken');
const colors = require('colors');


const registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (!name || !password || !email) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("User already exists")
  }

  //user added here
  const user = await User.create({
    name, email, password
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: "Added user sucessfully",
      user,
      token: generateToken(user._id)
    });
    console.log(`Added user sucessfully`.bgGreen.grey);
  } else {
    res.status(400);
    throw new Error("Failed to add user".bgRed.black)

  }
})


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const exists = await User.findOne({ email });
  console.log("Iam exits", exists.password);
  if (exists && (await exists.matchPassword(password))) {
    res.status(201).json({
      success: true,
      message: "Login user sucessfully",
      exists,
      token: generateToken(exists._id)
    });
    console.log(`Login user sucessfully`.bgGreen.red);

  } else {
    res.status(400)
    throw new Error("User Not Found".bgRed.black);
  }


})

//      /api/user?search=user3
const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ]
  } : {};

  console.log(keyword);

  const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
  res.send({
    success: true,
    message: "Found All User Successfull",
    users
  })
});

//exports
module.exports = { registerController, authUser, allUser }