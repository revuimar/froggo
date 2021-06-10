var chai = require("chai");
var chaiHttp = require("chai-http");
var {server} = require("../bin/www");
const db = require('../database/query');

chai.should();
chai.use(chaiHttp);
//HTTPS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//GENERATE MOCK DB DATA
// load XML of data objects and then drop them

// TODO unit testing!
