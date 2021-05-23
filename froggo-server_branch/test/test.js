var chai = require("chai");
var chaiHttp = require("chai-http");
var {server} = require("../bin/www");
const db = require('../query');

chai.should();
chai.use(chaiHttp);
//HTTPS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//GENERATE MOCK DB DATA
// load XML of data objects and then drop them

describe('Query API',()=>{
    describe('GET /api/branches/:page/:items',()=>{
        it("Should return branch data",(done)=>{
            chai.request(server)
                .get('/api/branches/1/1')
                .end((error,response)=>{
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    done();
                })
        })
    })


    describe('POST /api/branches',()=>{
        it("Should create new branch",(done)=>{
            const branch = {
                branch_name: "test_branch_name",
                password: "test_branch_pass"
            }
            chai.request(server)
                .post('/api/branches').send(branch)
                .end(async (error,response)=>{
                    response.should.have.status(200);
                    //response.body.should.be.a('array');
                    //drop created branch
                    await db.deleteBranch(branch.branch_name);
                    done();
                })
        })
    })
})
