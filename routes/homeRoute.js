const Router = require('express').Router();
const { staffLogin } = require('../controllers/loginController');
const verifyUser = require('../authentication/authStaff');
const path = require('path');

Router.get('/',(req,res, next)=>{
    res.sendFile(`${path.resolve()}/views/login.html`);
})

Router.post('/login', staffLogin);

Router.get('/getauth',verifyUser);

module.exports =  Router;