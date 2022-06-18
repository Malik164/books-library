const express= require('express')
const router= express.Router()
// find all books
const mongoose = require('mongoose')
const Book= require('../models/book')

//--------------- edit book route--------------------------
//@get only 4 recent books

router.route('/')
.get(async (req,res)=>{
    try {
        const findObj={}
        if(req.query.title!='' && req.query.title!=null){
            findObj.title=new RegExp(req.query.title.trim(),'ig')
        }
        const books=await Book.find(findObj).sort({createdAt:-1}).limit(4).exec()
        res.render('index',{books,query:req.query})
        
    } catch (error) {
        res.status(500).render('error',{message:'Something Went Wrong',code:500})
    }
})




module.exports= router