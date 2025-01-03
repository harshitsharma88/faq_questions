const catchBlock = require("../utils/errorHandler");
let { sql } = require('../dbConnection/sqlConnect');
const { executeStoredProcedure, executeQuery } = require("../dbConnection/executingQuery");

const sqlDataTypes = {
    'PARENTID' : sql.Int,
    'ROOTID' : sql.Int,
    'CTGRYID' : sql.Int,
    'QSTNID' : sql.Int,
    'PKGID' : sql.VarChar(50),
    'PAGE' : sql.VarChar(100),
    'STATUS' : sql.Bit
} 

async function getCategoryOrQuestion(req, res, next){
    try {
        console.log(req.param);
        res.status(200).json(req.param);
    } catch (error) {
        catchBlock(error, "Getting Category Or Question", res)
    }
}

async function storeRootCategory (req, res, next){
    try {
        const { description, title, login, page, isroot, child, parentid, pkgid} = req.body;
        const userid = req.user || 'Admin';
        const paramArray = [
            {name : "DESCRIPTION", type : sql.NVarChar(255), value : description},
            {name : "TITLE", type : sql.NVarChar(255), value : title},
            {name : "CREATEDBY", type : sql.NVarChar(100), value : userid},
            {name : "CREATEDDATE", type : sql.DateTime, value : new Date()},
            {name : "LOGIN", type : sql.Bit, value : login},
            {name : "PAGE", type : sql.NVarChar(255), value : page},
            {name : "ISROOT", type : sql.Bit, value : isroot},
            {name : "HASCHILD", type : sql.Bit, value : true},
            {name : "PARENTID", type : sql.Int, value : parentid},
            {name : "PKGID", type : sql.Int, value : pkgid}
        ];
        console.log(paramArray);
        const result = await executeStoredProcedure('FAQStoreRootCategory', paramArray);
        return res.status(200).send(result[0]);
    } catch (error) {
        catchBlock(error, 'Storing Question', res)
    }
}

async function storeNewQuestion (req, res, next){
    try {
        const { description, title, login, page, ctgryid, pkgid, answer, imageurl, videourl} = req.body;
        const userid  = req.user  || 'admin';
        const paramArray = [
            {name : "DESCRIPTION", type : sql.NVarChar(255), value : description},
            {name : "TITLE", type : sql.NVarChar(255), value : title},
            {name : "CREATEDBY", type : sql.NVarChar(255), value : userid},
            {name : "CREATEDDATE", type : sql.DateTime, value : new Date()},
            {name : "LOGIN", type : sql.Bit, value : login},
            {name : "PAGE", type : sql.NVarChar(255), value : page},
            {name : "CTGRYID", type : sql.Int, value : ctgryid},
            {name : "PKGID", type : sql.Int, value : pkgid}
        ];
        const result = await executeStoredProcedure('FAQ_ADD_QSTN', paramArray);
        if(req.body.answer){
            const answerParamArray = [
                {name : "ANSTEXT", type : sql.NVarChar(255), value : req.body.answer},           
                {name : "QSTNID", type : sql.Int, value : result[0].faq_qstn_id},
                {name : "VIDEOURL", type : sql.NVarChar(1000), value : videourl},
                {name : "IMAGEURL", type : sql.NVarChar(1000), value : imageurl},
                {name : "CREATEDDATE", type : sql.DateTime, value : new Date()},
                {name : "CREATEDBY", type : sql.NVarChar(50), value : userid}
            ];
            await executeStoredProcedure('FAQ_ADD_ANSWER_DETAILS', answerParamArray);
        }
        return res.status(200).json(result[0].faq_qstn_id);
    } catch (error) {
        catchBlock(error, 'Storing Question', res)
    }
}

async function storeNewAnswerDetails (req, res, next, addedByFunction){
    try {
        const {answer, qstnid, steps, imageurl, videourl, login} = req.body;
        const userid  = req.user  || 'admin';
        const paramArray = [
            {name : "ANSTEXT", type : sql.NVarChar(255), value : answer},           
            {name : "QSTNID", type : sql.Int, value : qstnid},           
            {name : "HASSTEPS", type : sql.Bit, value : steps},           
            {name : "IMAGEURL", type : sql.NVarChar(1000), value : imageurl},           
            {name : "VIDEOURL", type : sql.NVarChar(1000), value : videourl},
            {name : "LOGIN", type : sql.Bit, value : login},
            {name : "CREATEDDATE", type : sql.DateTime, value : new Date()},
            {name : "CREATEDBY", type : sql.NVarChar(50), value : userid}
        ];
        const result = await executeStoredProcedure('FAQ_ADD_ANSWER_DETAILS', paramArray);
        return res.status(200).json(result[0]);
    } catch (error) {
        catchBlock(error, 'Storing Question', res)
    }
}

async function getAllRootCategories(req, res, next){
    try {
        const result = await executeStoredProcedure('FAQ_GET_ALL_ACTIVE_ROOT_NEW');
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Getting All Root Categories.")
    }
}

async function getActiveRootCategories(req, res, next){
    try {
        const paramArray = [
            {name : 'STATUS', type : sqlDataTypes['STATUS'], value : 1}
        ];
        const result = await executeStoredProcedure('FAQ_GET_ALL_ACTIVE_ROOT_NEW', paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, 'Getting Root Caotegories', res);
    }
}

async function getCategoryDetails(req, res, next){
    try {
        const name =  Object.keys(req.query)[0];
        const paramArray = [
            {name, type : sqlDataTypes[name], value : req.query[name]}
        ];
        const result = await executeStoredProcedure('FaqGetCategoryDetailsByIdAndParent', paramArray);
        return res.status(200).json(result)
    } catch (error) {
        catchBlock(error, 'Getting Sub Category', res);
    }
}

async function getSubCategories(req, res, next){
    try {
        const paramArray = [
            {name : 'PARENTID', type : sqlDataTypes['PARENTID'], value : req.query.parentid}
        ];
        const result = await executeStoredProcedure('FAQ_GET_ALL_SUBCATEGORIES', paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, 'Getting Sub Categpries', res)
    }
}

// Nested Loop Method for getting answer for every question 
async function getCatgryQuestions(req, res, next){
    try {
        const qstnAnsObject = [];
        const name =  Object.keys(req.query)[0];
        const paramArray = [
            {name, type : sqlDataTypes[name], value : req.query[name]}
        ];
        const result = await executeStoredProcedure('FAQ_GET_QSTN_DETAILS', paramArray);
        if(Array.isArray(result) && result.length > 0){
            await Promise.all(result.map(async (qstn)=>{
                const ansParamArray = [
                    {name: 'QSTNID', type : sql.Int, value : qstn.faq_qstn_id}  
                ]
                const answer = await executeStoredProcedure('FAQ_GET_ANSWERBY_QSTNID', ansParamArray);
                if(Array.isArray(answer) && answer.length > 0){
                    qstnAnsObject.push(
                        {qstn : qstn.faq_qstn_title, ans : answer[0].ans_string}
                    )
                }
            }))
        };
        return res.status(200).json(qstnAnsObject);
    } catch (error) {
        catchBlock(error, 'Getting Category Wise Questions', res)
    }
}

// async function getQuestionAndAnswerPairs(req, res, next){
//     try {
//         const qstnAnsObject = [];
//         const name =  Object.keys(req.query)[0];
//         const paramArray = [
//             {name, type : sqlDataTypes[name], value : req.query[name]}
//         ];
//         const result = await executeStoredProcedure('FAQ_GET_QSTN_ANS_PAIR', req.query.length > 0 ? paramArray : null);
//         console.log(result.length);
//         return res.status(200).json(result);
//     } catch (error) {
//         catchBlock(error, 'Getting Question and Answer Pairs', res);
//     }

// }

async function getQuestionAndAnswerPairs(req, res, next){
    try {
        // Will Accept queries in PAGE & PKGID & CTGRYID & QSTNID
        const qstnAnsObject = [];
        const queriesArray =  Object.keys(req.query);
        const paramArray = [];
        queriesArray.forEach(key=>{
            paramArray.push(
                {name : key, type : sqlDataTypes[key], value : req.query[key]}
            )
        });
        const result = await executeStoredProcedure('FAQ_GET_QSTN_DETAILS', paramArray);
        console.log(result.length);
        return res.status(200).json({result});
    } catch (error) {
        catchBlock(error, 'Getting Question and Answer Pairs', res);
    }
}

async function getAnswerDetailsByQstnId(req, res, next){
    try {
        const name =  Object.keys(req.query)[0];
        const paramArray = [
            {name, type : sqlDataTypes[name], value : req.query[name]}
        ];
        const result = await executeStoredProcedure('FAQ_GET_ANSWERBY_QSTNID', paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, 'Getting Answers By QuestionID', res);
    }
}

async function editCategoryDetails(req, res, next){
    try {
        const {rootid, pkgid, loginrequire, has_child, status, description, page, title, isroot} = req.body;
        const userid  = req.user  || 'admin';
        const paramArray = [
            {name : "STATUS", type : sql.Bit, value : status},           
            {name : "ROOTID", type : sql.Int, value : rootid},
            {name : "UPDATEDBY", type : sql.NVarChar(50), value : userid},
            {name : "UPDATEDON", type : sql.DateTime, value : new Date()},
            {name : "PKGID", type : sql.NVarChar(50), value : pkgid},
            {name : "DESCRIPTION", type : sql.NVarChar(500), value : description},
            {name : "PAGE", type : sql.NVarChar(100), value : page},
            {name : "ISROOT", type : sql.Bit, value : isroot},
            {name : "FAQ_TITLE", type : sql.NVarChar(255), value : title},
            {name : "HASCHILD", type : sql.Bit, value : has_child},
            {name : "LOGIN_REQUIRED", type : sql.Bit, value : loginrequire}
        ]
        const result = await executeStoredProcedure('FAQ_CHANGE_CATEGORY_DETAILS',paramArray);
        return res.status(200).send(result[0]);
    } catch (error) {
        catchBlock(error, 'Changing root category status', res);
    }
}

async function editQuestionDetails(req, res, next){
    try {
        const {qstnid, pkgid, loginrequire, status, description, page, title} = req.body;
        const userid  = req.user  || 'admin';
        const paramArray = [
            {name : "STATUS", type : sql.Bit, value : status},           
            {name : "QSTNID", type : sql.Int, value : qstnid},
            {name : "UPDATEDBY", type : sql.NVarChar(50), value : userid},
            {name : "UPDATEDON", type : sql.DateTime, value : new Date()},
            {name : "PKGID", type : sql.NVarChar(50), value : pkgid},
            {name : "DESCRIPTION", type : sql.NVarChar(500), value : description},
            {name : "PAGE", type : sql.NVarChar(100), value : page},
            {name : "FAQ_QSTN_TITLE", type : sql.NVarChar(255), value : title},
            {name : "LOGIN_REQUIRED", type : sql.Bit, value : loginrequire}
        ]
        const result = await executeStoredProcedure('FAQ_CHANGE_QUESTION_DETAILS',paramArray);
        return res.status(200).send(result[0]);  
    } catch (error) {
        catchBlock();
    }
}

async function editAnswerDetails(req, res, next){
    try {
        const {qstnid, answertext, status, imageurl, videourl} = req.body;
        const userid = req.user || 'admin';
        const paramArray = [
            {name : "STATUS", type : sql.Bit, value : status},           
            {name : "QSTNID", type : sql.Int, value : qstnid},
            {name : "UPDATEDBY", type : sql.NVarChar(50), value : userid},
            {name : "UPDATEDON", type : sql.DateTime, value : new Date()},
            {name : "ANSTEXT", type : sql.NVarChar(1000), value : answertext},
            {name : "IMAGEURL", type : sql.NVarChar(1000), value : imageurl},
            {name : "VIDEOURL", type : sql.NVarChar(1000), value : videourl},
        ];
        const result = await executeStoredProcedure("TBL_FAQ_ANSWER_DETAILS", paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, "Editing Answer Details", res)
    }
}



module.exports = {
    getActiveRootCategories,
    getCategoryDetails,
    getCatgryQuestions,
    storeRootCategory,
    storeNewQuestion,
    getAnswerDetailsByQstnId,
    storeNewAnswerDetails,
    getAllRootCategories,
    editCategoryDetails,
    getSubCategories,
    editQuestionDetails,
    getQuestionAndAnswerPairs,
    getCategoryOrQuestion
}