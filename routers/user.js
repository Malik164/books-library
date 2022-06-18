const express = require('express')
const router= express.Router()
const User= require('../models/User')
const app= express()
app.use(express.urlencoded({extended:false}))
const passport= require('passport')
const {alreadyAuth}= require('../config/ensure_auth')

// sign up route
router.route('/new')
.get(alreadyAuth,(req,res)=>{
    
    const user= new User()
    res.render('users/form',{user})
})
.post(alreadyAuth, async(req,res)=>{
    try {
        // save user if none of user's field is empty
        const {uname,email,password}= req.body
        // make new user for saving to database
        const user= new User({
            uname,
            email,
            password
        })
        if(!uname || !email || !password){
            req.flash('err_msg','Please fill all the fields')
            res.status(400).render('users/form',{user})
            return
        }
        // otherwise get the hashed password and save it to database
        const hash= await user.hashPassword()
        user.password=hash
        await user.save()
        console.log(user);
        req.flash('success_msg','Successfully created account!')
        res.redirect('/users/new')

        
    } catch (error) {
        res.status(500).render('error',{message:'Something went wrong',code:500})
        console.log(error);
    }
})

// --------login route-------------
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/books/',
        failureRedirect:'/users/new',
        successMessage:'Signed in successfull!',
        failureFlash:true
    })(req,res,next)
    
})
//------------ log out route----------------
router.get('/logout',(req,res)=>{
    req.logOut()
    // show success messasges
    req.flash('success_msg','Logged Out Sucessfully!')
    res.redirect('/')
})



module.exports=router