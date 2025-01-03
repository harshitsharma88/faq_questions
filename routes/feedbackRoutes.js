const Router = require('express').Router();
const { storeAgentResponse, storeNewFeedbackQuestion, 
        getFeedbackQuestions} = require('../controllers-feedback/feedbackcontroller');

Router.post("/getpageqstn", getFeedbackQuestions);

Router.post("/storeqstn", storeNewFeedbackQuestion);

Router.post("/storeresponse", storeAgentResponse);

module.exports =  Router;