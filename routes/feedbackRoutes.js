const Router = require('express').Router();
const { storeAgentResponse, storeNewFeedbackQuestion, 
        getFeedbackQuestions, getAllFeedbackResponses,
        changeFeedbackQuestionDetails } = require('../controllers-feedback/feedbackcontroller');

Router.post("/getpageqstn", getFeedbackQuestions);

Router.post("/storeqstn", storeNewFeedbackQuestion);

Router.post("/storeresponse", storeAgentResponse);

Router.post("/editqstn", changeFeedbackQuestionDetails)

Router.get("/getresponse", getAllFeedbackResponses)

module.exports =  Router;