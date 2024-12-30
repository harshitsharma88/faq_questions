const Router = require('express').Router();
const {executeQuery, executeStoredProcedure} = require("../dbConnection/executingQuery");

Router.get('/deleteroot',async(req, res, next)=>{
    const params = {
        rootid : req.query.rootid
    }
    console.log(await executeQuery("Delete from TBL_FAQ_ROOT where faq_root_id = @rootid", params));
    return res.status(200).json("Done")
});

module.exports =  Router;