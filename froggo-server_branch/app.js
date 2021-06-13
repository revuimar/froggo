const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./database/query');
const dotenv = require('dotenv');
const auth = require('./auth');
const cors = require('cors');


dotenv.config();

var indexRouter = require('./routes/index');
var ordersRouter = require('./routes/orders');
var suppliesRouter = require('./routes/supplies');
var usersRouter = require('./routes/users');


var app = express();
app.use(cors({
    origin: 'https://localhost:3051',
    optionsSuccessStatus: 200,
    exposedHeaders: ['Authentication'],
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/', ordersRouter);
app.use('/', suppliesRouter);
app.use('/', usersRouter);

async function initdb(){
    console.log('app initialise')
    await db.createTables().then(()=>{
        console.log('database initialised');
    });
    db.Users.createMockUsers().then(()=>{
        console.log('user mock data added');
    });
    db.Supplies.createMockSupplies().then(()=>{
        console.log('supplies mock data added');
    });
   /* db.Orders.createMockOrders().then(()=>{
        console.log('orders mock data added');
    });*/
}

module.exports = {app,initdb};
