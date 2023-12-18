const asyncHandler = require('express-async-handler');
const User = require('../models/userModal');
const Chat = require('../models/chatModal');
const Message = require('../models/mesageModal');
const generateToken = require('../config/generateToken');
const colors = require('colors');






const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body

  //validation
  if (!chatId || !content) {
    console.log("Invalid data fill".bgRed.yellow);
    res.status(400).send({
      message: "Invalid data fill"
    })
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
  };


  try {
    var message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic');

    message = await message.populate('chat');

    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email'
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message
    })


    res.json(message)

  } catch (error) {
    throw new Error(error.message);
  }




})

const allMessage = asyncHandler(async (req, res) => {
  try {

    const message = await Message.find({ chat: req.params.chatId }).populate('sender', 'name pic email').populate('chat')

    res.json(message)


  } catch (error) {
    throw new Error(error.message)

  }

})



module.exports = { sendMessage, allMessage }