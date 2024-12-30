const jwt = require('jsonwebtoken');
let { poolPromise, sql } = require('../dbConnection/sqlConnect');
const catchBlock = require('../utils/errorHandler');
const { executeStoredProcedure, executeQuery } = require('../dbConnection/executingQuery');

function generateToken( userid, name ){
    return jwt.sign({userid, name}, process.env.JWT_SECRET_KEY);
}

const staffLogin = async function (req, res, next) {
    try {
        const {userid, password} = req.body;
        const paramArray = [
            {name : 'UserID', type: sql.NVarChar(100),value : userid},
            {name : 'Password', type: sql.NVarChar(100),value : password}
        ]
        const result = await executeStoredProcedure('GetLoginMemberByUserId', paramArray);
        const user = result[0];
        if(user && user.Status == 1){ 
        return res.status(200).json({token: generateToken(userid)});
        }
        return res.status(400).json('User Not Found')
    } catch (error) {
        catchBlock(error, 'Loging In User', res);
    }
}


module.exports = {
    staffLogin
}