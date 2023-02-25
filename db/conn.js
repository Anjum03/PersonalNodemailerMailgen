const mongoose = require('mongoose')

mongoose.set('strictQuery',false );

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected:`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  module.exports = connectDB;