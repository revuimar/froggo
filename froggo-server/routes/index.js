var express = require('express');
const auth = require('../auth');
const db = require('../database/query');
var router = express.Router();
const { sendMessage,getRooms } = require('../sync/socket');



/** @swagger
 *  components:
 *      requestBodies:
 *          CredentialBody:
 *              description: JSON containing ussername and password
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Credentials'
 *      schemas:
 *          Credentials:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      description: The user's name.
 *                  password:
 *                      type: string
 *                      description: The user's password.
 */

/** @swagger
 *  /api/login:
 *       post:
 *          summary: Returns JWT
 *          description: Takes user credentials verifies them and in case of correct data returns JWT
 *          requestBody:
 *              $ref: '#/components/requestBodies/CredentialBody'
 *          consumes:
 *              - application/json
 *          produces:
 *              - application/json
 *          parameters:
 *              - in: body
 *                schema:
 *                    type: object
 *                    properties:
 *                        username:
 *                              type: string
 *                        password:
 *                              type: string
 *                    example:
 *                        username: test
 *                        password: test
 *          responses:
 *              '200':
 *                  description: JWT
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *              '401':
 *                  description: error
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 */
router.post('/api/login', async (req, res) => {
    console.log(req.body)
    const token = await auth.generateAccessToken(
        {
            username: req.body.username,
            password: req.body.password
        });
    if (!token) res.status(401).json({error: 'no such user'});
    else res.json(token);
});

/*

        REMEMBER TO SETUP AUTHENTICATION!!!
        auth.authenticateToken

 */

router.get('/api/socket/rooms', async (req,res) => {
    const rooms = getRooms()
    res.status(200).json(rooms);
});

router.get('/api/socket', async (req,res) => {
    const roomId = '12345';
    const key = 'new-order';
    const message = 'new order assigned';
    sendMessage(roomId, key, message).then(()=>{
        res.status(200).send()
    },()=>{
        res.sendStatus(401);
        }
    );
});

module.exports = router;
