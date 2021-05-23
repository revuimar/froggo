var chai = require("chai");
var chaiHttp = require("chai-http");
var {server} = require("../bin/www");
const db = require('../query')


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
                    //response.body.should.be.a('array');
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
                .post('/api/branches')
                .set('Content-Type', 'application/json')
                .send(branch)
                .end((error,response)=>{
                    response.should.have.status(200);
                    //response.body.should.be.a('array');
                    //drop created branch
                    db.deleteBranch(branch.branch_name).then(done,done);
                })
        })
    })


    describe('POST /api/bulksupplies',()=>{
        it("Should create bulk supplies",(done)=>{
            const supplies =
                [
                    {item_name:Math.random().toString(36).substring(7), quantity: Math.floor(Math.random() * 50).toString(),branch_id: 1},
                    {item_name:Math.random().toString(36).substring(7), quantity: Math.floor(Math.random() * 50).toString(),branch_id: 1},
                    {item_name:Math.random().toString(36).substring(7), quantity: Math.floor(Math.random() * 50).toString(),branch_id: 1},
                    {item_name:Math.random().toString(36).substring(7), quantity: Math.floor(Math.random() * 50).toString(),branch_id: 1},
                    {item_name:Math.random().toString(36).substring(7), quantity: Math.floor(Math.random() * 50).toString(),branch_id: 1},
                    {item_name:Math.random().toString(36).substring(7), quantity: Math.floor(Math.random() * 50).toString(),branch_id: 1},
                    {item_name:Math.random().toString(36).substring(7), quantity: Math.floor(Math.random() * 50).toString(),branch_id: 1},
                    {item_name:Math.random().toString(36).substring(7), quantity: Math.floor(Math.random() * 50).toString(),branch_id: 1}
                ];
            /*
            {item_name: ${Math.random().toString(36).substring(7)}, quantity: ${Math.floor(Math.random() * 50).toString()},last_update: ${db.sequelize.fn('NOW').toString()}},
                {item_name: ${Math.random().toString(36).substring(7)}, quantity: ${Math.floor(Math.random() * 50).toString()},last_update: ${db.sequelize.fn('NOW').toString()}},
                {item_name: ${Math.random().toString(36).substring(7)}, quantity: ${Math.floor(Math.random() * 50).toString()},last_update: ${db.sequelize.fn('NOW').toString()}}

             */

            chai.request(server)
                .post('/api/bulksupplies')
                .set('Content-Type', 'application/json')
                .send({supplies})
                .end( (error,response)=>{
                    response.should.have.status(200);
                    console.log(response.body)
                    const result = response.body
                    //response.body.should.be.a('array');
                    //drop created branch
                    //await db.deleteBranch(branch.branch_name);
                    var ids = []
                    for (i in result){
                        ids.push(Number(result[i].item_id))
                    }
                    db.deleteSupplies(ids).then(done,done);

                })
        })
    })

    describe('POST /api/sync/delivery',()=>{
        it("Should create order delivery records in bulk",(done)=>{
            const orders =
                [
                    {key: Math.random().toString(36).substring(7),
                     list: [
                         {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                         {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                         {"item_name": Math.random().toString(36).substring(7),"quantity": 4}
                        ],
                         status: 0,
                         branch_id: 1
                    },
                    {key: Math.random().toString(36).substring(7),
                        list: [
                            {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                            {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                            {"item_name": Math.random().toString(36).substring(7),"quantity": 4}
                        ],
                        status: 0,
                        branch_id: 1
                    },
                    {key: Math.random().toString(36).substring(7),
                        list: [
                            {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                            {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                            {"item_name": Math.random().toString(36).substring(7),"quantity": 4}
                        ],
                        status: 0,
                        branch_id: 1
                    }
                ];

            chai.request(server)
                .post('/api/sync/delivery')
                .set('Content-Type', 'application/json')
                .send({orders})
                .end( (error,response)=>{

                    response.should.have.status(200);
                    console.log('from test',response.body)
                    const result = response.body
                    //response.body.should.be.a('array');
                    //drop created branch
                    //await db.deleteBranch(branch.branch_name);
                    let ids = []
                    for (i in result){
                        ids.push(Number(result[i].delivery_id))
                    }
                    db.deleteDeliveries(ids).then(done,done);
                })
        })
    })
})
