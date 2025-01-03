const catchBlock = require("../utils/errorHandler");
let { sql } = require('../dbConnection/sqlConnect');
const { executeStoredProcedure, executeQuery } = require("../dbConnection/executingQuery");

async function getFeedbackQuestions(req, res, next){
    try {
        const {agentid, page} = req.body;
        // const agentid = "CHAGT123";
        // const page = "Zodiac";
        const repliedQuestions = {};
        const questionParamArray = [
            {name : "STATUS" , type : sql.Bit, value : 1},
            {name : "PAGE" , type : sql.NVarChar(100), value : page}
        ];
        const responseParamArray = [
            {name : "AGENTID" , type : sql.NVarChar(50), value : agentid},
            {name : "PAGE" , type : sql.NVarChar(100), value : page}
        ];
        const feedbackQuestionsPromise = executeStoredProcedure("FEEDBACK_GET_ALL_QUESTIONS", questionParamArray);
        const responsesPromise = executeStoredProcedure("FEEDBACK_GET_AGENT_RESPONSES", responseParamArray);

        const [{value:questions},{value:responses}] = await Promise.allSettled([feedbackQuestionsPromise, responsesPromise]);
        responses.forEach(response=>{
            repliedQuestions[response.feed_qstn_id] = true
        });
        const allAvailableQuestions = [];
        questions.forEach((question => {
            if(!repliedQuestions[question.feed_qstn_id] && question.status) 
                allAvailableQuestions.push({qstnid : question.feed_qstn_id, title : question.feed_qstn_title});
            }));
        return res.status(200).json(allAvailableQuestions)
    } catch (error) {
        catchBlock(error, "Getting Feedback Questions", res)
    }
}

async function storeNewFeedbackQuestion(req, res, next){
    try {
        const {title, page} = req.body;
        const userid = req.user || "admin";
        const paramArray = [
            {name : "TITLE", type: sql.NVarChar(1000), value : title},
            {name : "PAGE", type: sql.NVarChar(100), value : page},
            {name : "CREATEDBY", type: sql.NVarChar(50), value : userid},
            {name : "CREATEDAT", type: sql.DateTime, value : new Date()},

        ]
        const result = await executeStoredProcedure("FEEDBACK_STORE_NEW_QUESTION", paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Storing New FeedBack Question", res);
    }
}

async function storeAgentResponse(req, res, next){
    try {
        const {agentid, responsetext, rating, page, qstntitle, qstnid} = req.body;
        const questionIncrement = await executeStoredProcedure("FEEDBACK_UPDATE_QUESTION_DETAILS",incrementSPArray);
        const paramArray = [
            {name : "AGENTID", type : sql.NVarChar(50), value : agentid},
            {name : "QSTNID", type : sql.Int, value : qstnid},
            {name : "CREATEDAT", type : sql.DateTime, value : new Date()},
            {name : "RESPONSETEXT", type : sql.NVarChar(1000), value : responsetext},
            {name : "QSTNTITLE", type : sql.NVarChar(1000), value : qstntitle},
            {name : "RATING", type : sql.Int, value : rating},
            {name : "PAGE", type : sql.NVarChar(100), value : page}
        ]
        const incrementSPArray = [
            {name : "INCREASEVALUE", type : sql.Bit, value :1},
            {name : "QSTIND", type : sql.Int, value :qstnid}
        ]
        
        const result = await executeStoredProcedure("FEEDBACK_STORE_AGENT_RESPONSE", paramArray);
        console.log(questionIncrement);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Storing Agent Response", res)
    }
}

module.exports = {
    getFeedbackQuestions,
    storeAgentResponse,
    storeNewFeedbackQuestion
}
