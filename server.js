const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const plaidRoutes = require('./routes/PlaidRoutes');
const bankRoutes = require('../routes/BankRoutes');
const userRoutes = require('../routes/UserRoutes');
const authRoutes = require('../routes/AuthRoutes');

require('dotenv').config();

// Connect the Database
connectDB();

// intiialize the app
const app = express();

// parse json
app.use(express.json());

//cross origin from other sources
app.use(cors());

//Routes

app.use('api/users',userRoutes);
app.use('api/bank',bankRoutes);
app.use('api/plaid',plaidRoutes);
app.use('api/auth', authRoutes);

app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Internal Server Error'});
});

if(!process.env.DB_URI){
    console.error("ERROR: DB_URI enironment is missing.");
    process.exit(1);
}

module.exports = app;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});