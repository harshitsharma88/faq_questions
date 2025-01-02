const Router = require('express').Router();
const authenticate = require('../authentication/authStaff');
const { getActiveRootCategories, getCategoryDetails, getCatgryQuestions, 
        storeRootCategory, storeNewQuestion, getAnswerDetailsByQstnId,
        getAllRootCategories, editCategoryDetails, getSubCategories, 
        editQuestionDetails, storeNewAnswerDetails, getQuestionAndAnswerPairs} = require('../controllers/get&StoreQuestion');

Router.post('/setroot', storeRootCategory);

Router.post('/addqstn', storeNewQuestion);

Router.post("/addans", storeNewAnswerDetails);

Router.post('/editcategory', editCategoryDetails);

Router.post("/editqstn", editQuestionDetails);

Router.get('/getallroots', getAllRootCategories);

Router.get('/getactiveroot', getActiveRootCategories);

Router.get('/getctgry', getCategoryDetails);

Router.get('/subcategories',getSubCategories);

Router.get('/getqstns', getCatgryQuestions);

Router.get("/getqstnans", getQuestionAndAnswerPairs);

Router.get('/getans', getAnswerDetailsByQstnId);

module.exports = Router;