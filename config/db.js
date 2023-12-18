const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(`${process.env.MONGO_URL}`, { useUnifiedTopology: true, useNewUrlParser: true })

    console.log(`Connected to MongoDb ${conn.connection.host}`.bgYellow.black);

  } catch (error) {
    console.log("Erro in Db connection".bgRed.black, error);
    process.exit(1);
  }


}

module.exports = connectDB;