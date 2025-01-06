const Router = require('express').Router();
const { storeAgentResponse, storeNewFeedbackQuestion, 
        getFeedbackQuestions, getAllFeedbackResponses} = require('../controllers-feedback/feedbackcontroller');

Router.post("/getpageqstn", getFeedbackQuestions);

Router.post("/storeqstn", storeNewFeedbackQuestion);

Router.post("/storeresponse", storeAgentResponse);

Router.get("/getresponse", getAllFeedbackResponses)

module.exports =  Router;