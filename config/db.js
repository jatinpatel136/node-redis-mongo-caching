const mongoose = require('mongoose');

//gacs gacs

//mongodb+srv://gacs:<password>@cluster0.lxlyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const connectDB = async () => {
    console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })

    console.log(`Mongodb connected: ${conn.connection.host}`)
}

module.exports = connectDB;