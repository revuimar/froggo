var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./query')
var cors = require('cors')


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

app.get('/branches', db.getBranches)
app.get('/branches/:id', db.getBranchById)
app.post('/branches', db.createBranch)

module.exports = {app,initdb};
