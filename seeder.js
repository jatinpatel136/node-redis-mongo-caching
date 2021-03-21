const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config/config.env' });


// Load database Models
const Employee = require('./models/Employee');

// Connect to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true });

// Read Json file data
const employees = JSON.parse(fs.readFileSync(`${__dirname}/_data/employees.json`, 'utf-8'));

const importData = async () => {
    try {
        await Employee.create(employees);
        console.log(`Data imported..`);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async () => {
    try {
        await Employee.deleteMany();
        console.log('Data deleted..');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}