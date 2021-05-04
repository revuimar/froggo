var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./query');
const dotenv = require('dotenv');
const auth = require('./auth');
var cors = require('cors')

dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter)

function initdb(){
    console.log('app initialise')
    db.createTables().then((res)=>{
        console.log(res);
    });
}

app.get('/branches',auth.authenticateToken, db.getBranches)
app.get('/branches/:id',auth.authenticateToken, db.getBranchById)
app.get('/branches/:username/:password', db.verifyUser)
app.post('/branches',auth.authenticateToken, db.createBranch)

module.exports = {app,initdb};
