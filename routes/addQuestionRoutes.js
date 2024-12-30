const Router = require('express').Router();
const authenticate = require('../authentication/authStaff');
const { getActiveRootCategories, getCategoryDetails, getCatgryQuestions, 
        storeRootCategory, storeNewQuestion, getAnswerDetailsByQstnId,
        getAllRootCategories, changeRootCategoryStatus, getSubCategories} = require('../controllers/get&StoreQuestion');

Router.post('/setroot', storeRootCategory);

Router.post('/addqstn', storeNewQuestion);

Router.get('/getallroots', getAllRootCategories);

Router.get('/getactiveroot', getActiveRootCategories);

Router.get('/getctgry', getCategoryDetails);

Router.get('/subcategories',getSubCategories);

Router.get('/getctgryqstn/:id', getCatgryQuestions);

Router.get('/getans', getAnswerDetailsByQstnId);

Router.post('/changectgrystatus',changeRootCategoryStatus);

module.exports = Router;