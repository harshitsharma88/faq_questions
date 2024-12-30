const jwt = require('jsonwebtoken');
let { poolPromise, sql } = require('../dbConnection/sqlConnect');
const catchBlock = require('../utils/errorHandler');


async function verifyAuthToken(req, res, next){
    try {
        if(!req.header("Authorization")){
            return res.redirect(301, '/');
        }
        const decodedData = jwt.verify( req.header("Authorization"), process.env.JWT_SECRET_KEY);
        req.user = decodedData.userid;
        if(!decodedData.userid)return res.redirect(301,'/');
        next();
    } catch (error) {
        res.redirect(301, '/');
        catchBlock(error, 'Verifying Auth Token', null);
    }
}

module.exports = verifyAuthToken;