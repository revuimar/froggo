const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./query');
const dotenv = require('dotenv');
const auth = require('./auth');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yaml');

dotenv.config();

var indexRouter = require('./routes/index');


var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
app.use(cookieParser());

app.use('/', indexRouter);
//app.use('/users', usersRouter)

function initdb() {
    console.log('app initialise')
    db.createTables().then((res)=>{
        console.log('database initialised');
    });
}

module.exports = {app,initdb};
