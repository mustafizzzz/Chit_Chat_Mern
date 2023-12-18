const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


//configure env
dotenv.config()

//connection Call
connectDB();

//rest object
const app = express()

//middleware
app.use(cors());
app.use(express.json())//to accept json data
app.use(morgan('dev'))


//rest api creates
app.get('/', (req, res) => {
  res.send("<h1>Welcome to Chat App</h1>")

})

//routes
app.use(`/api/user`, userRoutes);
app.use(`/api/chat`, chatRoutes);
app.use(`/api/message`, messageRoutes);
//middleware for error
app.use(notFound);
app.use(errorHandler);


//PORT
const PORT = process.env.PORT || 8080;

//run listen
const server = app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgGreen.white);
})

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*'
  },
});

io.on('connection', (socket) => {
  console.log(`Connected to Socket.io`.bgMagenta.yellow);
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('Connect')

  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room.bgCyan);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'))
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

  socket.on('new message', (newMessageRec) => {
    var chat = newMessageRec.chat;
    if (!chat.users) {
      return console.log('Chat.users is not defined');
    }

    chat.users.forEach(user => {
      if (user._id == newMessageRec.sender._id) return;
      socket.in(user._id).emit('message received', newMessageRec)
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id)
  });
})