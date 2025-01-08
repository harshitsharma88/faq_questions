const catchBlock = require("../utils/errorHandler");
let { sql } = require('../dbConnection/sqlConnect');
const { executeStoredProcedure } = require("../dbConnection/executingQuery");

// Unreplied Questions Page wise
async function unRepliedFeedbackQuestions(req, res, next){
    try {
        const {agentid, page} = req.body;
        const paramArray = [
            {name : "AGENTID" , type : sql.NVarChar(50), value : agentid},
            {name : "PAGE" , type : sql.NVarChar(100), value : page}
        ];
        const result = await executeStoredProcedure("FEEDBACK_GET_UNREPLIED_QUESTION_BY_PAGE", paramArray);
        return res.status(200).json(result)
        // // const agentid = "CHAGT123";
        // // const page = "Zodiac";
        // const repliedQuestions = {};
        // const questionParamArray = [
        //     {name : "STATUS" , type : sql.Bit, value : 1},
        //     {name : "PAGE" , type : sql.NVarChar(100), value : page}
        // ];
        // const responseParamArray = [
        //     {name : "AGENTID" , type : sql.NVarChar(50), value : agentid},
        //     {name : "PAGE" , type : sql.NVarChar(100), value : page}
        // ];
        // const feedbackQuestionsPromise = executeStoredProcedure("FEEDBACK_GET_ALL_QUESTIONS", questionParamArray);
        // const responsesPromise = executeStoredProcedure("FEEDBACK_GET_AGENT_RESPONSES", responseParamArray);

        // const [{value:questions},{value:responses}] = await Promise.allSettled([feedbackQuestionsPromise, responsesPromise]);
        // responses.forEach(response=>{
        //     repliedQuestions[response.feed_qstn_id] = true
        // });
        // const allAvailableQuestions = [];
        // questions.forEach((question => {
        //     if(!repliedQuestions[question.feed_qstn_id] && question.status) 
        //         allAvailableQuestions.push({qstnid : question.feed_qstn_id, title : question.feed_qstn_title});
        //     }));
        // return res.status(200).json(allAvailableQuestions)
    } catch (error) {
        catchBlock(error, "Getting Feedback Questions", res)
    }
}

// All Questions disabled or enabled
async function getAllFeedbackQuestions(req, res, next){
    try {
        const {status, page} = req.query;
        const paramArray = [
            {name : "STATUS" , type : sql.NVarChar(50), value : status},
            {name : "PAGE" , type : sql.NVarChar(100), value : page}
        ];
        const result = await executeStoredProcedure("FEEDBACK_GET_ALL_QUESTIONS", paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Getting All Feedback Questions", res)
    }
}

async function storeNewFeedbackQuestion(req, res, next){
    try {
        const {title, page, response_options} = req.body;
        const userid = req.user || "admin";
        const paramArray = [
            {name : "TITLE", type: sql.NVarChar(1000), value : title},
            {name : "PAGE", type: sql.NVarChar(100), value : page},
            {name : "CREATEDBY", type: sql.NVarChar(50), value : userid},
            {name : "CREATEDAT", type: sql.DateTime, value : new Date()},
            {name : "RESPONSEOPTION", type : sql.NVarChar(1000), value : JSON.stringify(response_options || {})}
        ];
        const result = await executeStoredProcedure("FEEDBACK_STORE_NEW_QUESTION", paramArray);
        console.log(req.body,"\n", result)
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Storing New FeedBack Question", res);
    }
}

async function storeAgentResponse(req, res, next){
    try {
        const {agentid, responsetext, rating, qstnid, page} = req.body;
            const paramArray = [
                {name : "AGENTID", type : sql.NVarChar(50), value : agentid},
                {name : "QSTNID", type : sql.Int, value : qstnid},
                {name : "CREATEDAT", type : sql.DateTime, value : new Date()},
                {name : "RESPONSETEXT", type : sql.NVarChar(1000), value : responsetext},
                {name : "RATING", type : sql.Int, value : rating},
                {name : "PAGENAME", type : sql.VarChar(50), value : page}
            ];            
            const result = await executeStoredProcedure("FEEDBACK_STORE_AGENT_RESPONSE", paramArray);
            return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Storing Agent Response", res)
    }
}

async function getAllFeedbackResponses(req, res, next){
    try {
        const {page, qstnid, agentid} = req.body;
        const paramArray = [
            {name : "PAGE", type : sql.NVarChar(100), value : page},
            {name : "QSTNID", type : sql.Int, value : qstnid},
            {name : "AGENTID", type : sql.VarChar(), value : agentid}
        ]
        const result = await executeStoredProcedure("FEEDBACK_GET_AGENT_RESPONSES",paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Getting All FeedBack responses", res)
    }
}

async function changeFeedbackQuestionDetails(req, res, next){
    try {
        const {qstnid, qstntitle, status, response_options} = req.body;
        const paramArray = [
            {name : "QSTNId", type : sql.Int, value : qstnid},
            {name : "QSTNTITLE", type : sql.VarChar, value : qstntitle},
            {name : "RESPONSEOPTIONS", type : sql.NVarChar(), value : JSON.stringify(response_options)},
            {name : "STATUS", type : sql.Bit, value : status}
        ];
        const result = await executeStoredProcedure("FEEDBACK_UPDATE_QUESTION_DETAILS", paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Editing Feedback Question Details")
    }
}

module.exports = {
    unRepliedFeedbackQuestions,
    storeAgentResponse,
    storeNewFeedbackQuestion,
    getAllFeedbackResponses,
    changeFeedbackQuestionDetails,
    getAllFeedbackQuestions
}
