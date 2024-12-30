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
            {name : "HASCHILD", type : sql.Bit, value : child},
            {name : "PARENTID", type : sql.Int, value : parentid},
            {name : "PKGID", type : sql.Int, value : pkgid}
        ];
        const result = await executeStoredProcedure('FAQStoreRootCategory', paramArray);
        return res.status(200).send(result[0]);
    } catch (error) {
        catchBlock(error, 'Storing Question', res)
    }
}

async function storeNewQuestion (req, res, next){
    try {
        const { description, title, login, page, ctgryid, pkgid} = req.body;
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
        return res.status(200).json(result[0].faq_qstn_id);
    } catch (error) {
        catchBlock(error, 'Storing Question', res)
    }
}

async function storeNewAnswerDetails (req, res, next){
    try {
        const {answer, qstnid, steps, imageurl, videourl, login} = req.body;
        const userid  = req.user  || 'admin';
        const paramArray = [
            {name : "ANSTEXT", type : sql.NVarChar(255), value : answer},           
            {name : "QSTNID", type : sql.Int, value : qstnid},           
            {name : "HASSTEPS", type : sql.Bit, value : steps},           
            {name : "IMAGEURL", type : sql.NVarChar(1000), value : imageurl},           
            {name : "VIDEOURL", type : sql.NVarChar(1000), value : videourl},
            {name : "CREATEDBY", type : sql.NVarChar(50), value : userid},
            {name : "CREATEDDATE", type : sql.DateTime, value : new Date()},
            {name : "LOGIN", type : sql.Bit, value : login}
        ];
        const result = await executeStoredProcedure('FAQ_ADD_ANSWER_DETAILS', paramArray);
        return res.status(200).json(result[0].faq_qstn_id);
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

async function getCatgryQuestions(req, res, next){
    try {
        const name =  Object.keys(req.query)[0];
        const paramArray = [
            {name, type : sqlDataTypes[name], value : req.query[name]}
        ];
        const result = await executeStoredProcedure('Faq_Get_Qstn_Details', paramArray);
        return res.status(200).json(result);
    } catch (error) {
        catchBlock(error, 'Getting Category Wise Questions', res)
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

async function changeRootCategoryStatus(req, res, next){
    try {
        const {rootid, action} = req.body;
        console.log(rootid, action);
        const paramArray = [
            {name : "STATUS", type : sql.Bit, value : action == 'enable'},           
            {name : "ROOTID", type : sql.Int, value : rootid}
        ]
        const result = await executeStoredProcedure('FAQ_CHANGE_ROOT_CAT_STATUS',paramArray);
        return res.status(200).send(result[0]);
    } catch (error) {
        catchBlock(error, 'Changing root category status', res);
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
    changeRootCategoryStatus,
    getSubCategories
}