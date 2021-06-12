const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./database/query');
const dotenv = require('dotenv');
const auth = require('./auth');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc');

//const YAML = require('yamljs');
//const swaggerDocument = YAML.load('./swagger/swagger.yaml');

const swaggerOptions = {
    swaggerDefinition: {
        components: {},
        info: {
            title: "Rest API",
            description: "A simple rest API"
        },
        servers: [
            {
                url: 'https://localhost:3001',
                description: 'Development server'
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);



dotenv.config();

var indexRouter = require('./routes/index');
var branchRouter = require('./routes/branch');
var deliveryRouter = require('./routes/delivery');
var suppliesRouter = require('./routes/supplies');
var userRouter = require('./routes/user');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/*
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Content-Type' , 'application/json')
    next();
});
*/
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs))
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/', branchRouter);
app.use('/', deliveryRouter);
app.use('/', suppliesRouter);
app.use('/', userRouter);


function initdb() {
    console.log('app initialise')
    db.createTables().then((res)=>{
        console.log('database initialised');
    });
}

module.exports = {app,initdb};
