const mongoose = require('mongoose');

//gacs gacs

// use MONGO_DIRECT_URI if want to connect on mongodb external service
//mongodb+srv://gacs:<password>@cluster0.lxlyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// use MONGO__URI when want to connect the mongo inside container 
const connectDB = async () => {
    try {
        // error in connection to mongodb contianer was solved using this url https://github.com/docker/hub-feedback/issues/1255 - use your mongodb service name instead of localhost or 127.0.0.1
        
        console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })

        console.log(`Mongodb connected: ${conn.connection.host}`)        
    } catch (error) {
        console.log(error)
    }

}

module.exports = connectDB;