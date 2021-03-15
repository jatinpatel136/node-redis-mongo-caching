const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
var redis = require('redis');
const Employee = require('./models/Employee');
const connectDB = require('./config/db');

console.log(process.env.REDIS_URL)
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", function(error) {
    console.error(error);
});

// Load env files
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Body Parser
app.use(express.json())

// Enable CORS
app.use(cors());

app.get('/', (req, res) => {
    res.send('Root path')
});

app.post('/employees', async (req, res, next) => {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
})

app.get('/employees', async (req, res, next) => {
    const employees = await Employee.find();
    res.status(200).json({ success: true, data: employees });
})

app.get('/employees/:id', async (req, res, next) => {

    const { id } = req.params;

    client.get(id, async(err,data)=>{
        if(err) throw err
       
        if(data != null){
            console.log('Fetched frome cache')
            res.status(200).json({ success: true, data:JSON.parse(data) });
        }
        else{
            const employee = await Employee.findById(id);
            console.log('Fetched from mongodb')
            if (!employee) {
                // This is error when Object id is properly formatted but not found in Database
                return next(new ErrorResponse(`Employee with ${req.params.id} not found`, 404));
            }
            res.status(200).json({ success: true, data: employee });
            client.set(id, JSON.stringify(employee))
        }
    })
});

app.put('/employees/:id', async (req, res, next) => {
    let employee = await Employee.findById(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!employee) {
        return next(new ErrorResponse(`Employee with ${req.params.id} not found`, 404));
    }

    employee = await Employee.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: employee });
});

app.delete('/employees/:id', async (req, res, next) => {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
        return next(new ErrorResponse(`Employee with ${req.params.id} not found`, 404));
    }

    employee.remove();

    res.status(200).json({ success: true, data: {} });
})

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`server running on ${PORT}`));

// // Handle unhandled promise rejection
// process.on('unhandledRejection', (err, promise) => {
//     console.log(`Error: ${err.message}`);
//     // close server and exit
//     server.close(() => process.exit(1));
// })
