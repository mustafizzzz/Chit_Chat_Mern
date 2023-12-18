const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModal');
const User = require('../models/userModal');
const generateToken = require('../config/generateToken');
const colors = require('colors');



const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;


  if (!userId) {
    console.log("User Id param not sent with request".bgBlue.yellow);
    return res.sendStatus(400)
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },

    ],
  }).populate('users', '-password')
    .populate('latestMessage')
  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId]
    }
  }

  try {
    const createdChat = await Chat.create(chatData);

    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password')

    res.status(200).send({
      message: "New Chats Creation",
      FullChat
    })

  } catch (error) {
    res.status(400);
    throw new Error(error.message)

  }

})


const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage').sort({ updateAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email"
        })
        res.send({
          message: "Fetch the user Chats",
          result
        })
      })




  } catch (error) {
    res.status(400);
    throw new Error(error.message)

  }

})


const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(404).send({ message: "Fill all the Required Details" })
  }
  var users = JSON.parse(req.body.users);
  console.log("My user in grp".bgBlue.black, users);

  if (users.length < 2) {
    return res.status(400).send({
      message: "More than Two users for group chat"
    })
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);

  }


})


const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName, }, { new: true, }).populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      res.status(400);
      throw new Error("Chat Not Found");
    } else {
      res.json({
        message: "Updated group name Success",
        updatedChat
      })
    }



  } catch (error) {
    res.status(400);
    throw new Error(error.message);

  }

})


const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(chatId, {
    $push: { users: userId },
  }, { new: true },).populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (added) {
    res.json(added)

  } else {
    res.status(400)
    throw new Error("Chat Not Found")
  }


})


const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const remove = await Chat.findByIdAndUpdate(chatId, {
    $pull: { users: userId },
  }, { new: true },).populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (remove) {
    res.json(remove)

  } else {
    res.status(400)
    throw new Error("Chat Not Found")
  }


})


module.exports = { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup }