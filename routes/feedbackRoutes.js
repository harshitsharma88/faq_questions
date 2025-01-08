const Router = require('express').Router();
const { storeAgentResponse, storeNewFeedbackQuestion, 
        unRepliedFeedbackQuestions, getAllFeedbackResponses,
        changeFeedbackQuestionDetails, getAllFeedbackQuestions } = require('../controllers-feedback/feedbackcontroller');

Router.post("/getpageqstn", unRepliedFeedbackQuestions);

Router.post("/storeqstn", storeNewFeedbackQuestion);

Router.post("/storeresponse", storeAgentResponse);

Router.post("/editqstn", changeFeedbackQuestionDetails);

Router.post("/getresponse", getAllFeedbackResponses);

Router.get("/getallqstn", getAllFeedbackQuestions)

module.exports =  Router;