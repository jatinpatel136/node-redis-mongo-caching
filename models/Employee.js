const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    gender: String,
    email: String,
    designation: String,
    type: String
})

module.exports = mongoose.model('Employee', EmployeeSchema);