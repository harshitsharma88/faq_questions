const Router = require('express').Router();
const authenticate = require('../authentication/authStaff');
const { getActiveRootCategories, getCategoryDetails, getCatgryQuestions, 
        storeRootCategory, storeNewQuestion, getAnswerDetailsByQstnId,
        getAllRootCategories, editCategoryDetails, getSubCategories, 
        editQuestionDetails} = require('../controllers/get&StoreQuestion');

Router.post('/setroot', storeRootCategory);

Router.post('/addqstn', storeNewQuestion);

Router.get('/getallroots', getAllRootCategories);

Router.get('/getactiveroot', getActiveRootCategories);

Router.get('/getctgry', getCategoryDetails);

Router.get('/subcategories',getSubCategories);

Router.get('/getqstns', getCatgryQuestions);

Router.get('/getans', getAnswerDetailsByQstnId);

Router.post('/editcategory', editCategoryDetails);

Router.post("/editqstn", editQuestionDetails);

module.exports = Router;