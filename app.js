const express = require('express')
const app=express()
const mongoose= require('mongoose')
const methodOverride = require('method-override')
const session= require('express-session')
const flash= require('express-flash')
const passport= require('passport')
require('./config/passport_local')(passport)

//-----------express setup----------------
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true,limit:'20mb'}))
app.use('*/css',express.static(__dirname+'/public/css'))
app.use('*/js',express.static(__dirname+'/public/js'))
app.use(express.static(__dirname+'/public'))
// connect mongoose
mongoose.connect('mongodb://localhost/libraryDB').then(()=> console.log('DB is connected!')).catch(e=>console.log(e.message))
// global middlewares
app.use(methodOverride('_method'))

app.use(session({
    secret:'nosecret',
    saveUninitialized:false,
    resave:true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
//------------- GLOBAL VARIALBES FOR SHOWING MESSAGES-----------------
app.use(function(req,res,next) {
    res.locals.err_msg=req.flash('err_msg')
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error=req.flash('error')
    res.locals.user=req.user
    next()
})

//------------- index route-----------------
app.use('/',require('./routers/home'))

//------------ books route-----------
app.use('/books',require('./routers/books'))

//----------- users sign or login route-------------
app.use('/users',require('./routers/user'))


//- 404 page-----
app.get('/*',(req,res)=> res.status(404).render('error',{message:'Page you are looking for not Found',code:404}))
// error handler

app.use((error,req,res,next)=>{
    if(error){
        res.status(500).render('error',{message:'Internal Server Error',code:500})
        console.log(error)
        next()
    }
})

app.listen(process.env.PORT||3000,()=>console.log('Server is started at http://localhost:3000'))