const express= require('express')
const app= express()
app.use(express.urlencoded({extended:true}))
const Book= require('../models/book')
const router= express.Router()
const passport = require('passport')
const {ensureAuth}= require('../config/ensure_auth')

// get all books
router.route('/')
.get(async(req,res)=>{

    try {
        const books= await Book.find().exec()
        // send all books to ui
        res.render('books/books',{books})
    } catch (error) {
        res.status(500).render('error',{message:'Internal Server Error',code:500})
    }
})
.post(async(req,res)=>{
    try {
        let sortField= req.body.filter;
        const books= await Book.find().sort([[sortField,1]]).exec()
        res.render('books/books',{books})
    } catch (error) {
        console.log(error);
        res.status(500).render('error',{message:'Internal Server Error',code:500})
        
    }
})
//--------------- edit book route--------------------------
//@get
router.route('/add')
.get(ensureAuth,(req,res)=>{
    const book= new Book()
    res.render('books/add',{book})
})
// add book post
.post(ensureAuth,async (req,res)=>{
    
    const {title,description,pages,author,cover}=req.body
    // save book to database
    let book= new Book({
        title,
        description,
        pages,
        author
    })
    saveCover(book,cover)
    try {
        const newBook = await book.save()
        req.flash('success_msg','Successfuly new book saved!')
        res.redirect(`/books/${newBook._id}`)
        
    } catch (error) {
     res.status(403).render('books/add',{book})   
    }
})

// ---------------------------CRUD OPEARTION FOR BOOK--------------
router.route('/:id')
.get(async(req,res)=>{
    // find the specifc book by id
    try {
        const foundBook= await Book.findById(req.params.id).exec()
        res.render('books/book',{book:foundBook,user:req.user})
        
    } catch (error) {
        res.status(500).render('error',{message:'Something Went Wrong',code:500})
    }
    
})
.put(async(req,res)=>{
    const {title,description,pages,author,cover}=req.body
    try {
        const foundBook=await Book.findById(req.params.id).exec()
        foundBook.title=title
        foundBook.description=description
        foundBook.pages=pages
        foundBook.author=author
        saveCover(foundBook,cover)
        await foundBook.save()
        req.flash('success_msg','Successfuly Book Updated!')
        res.status(204).redirect(`/books/${foundBook._id}`)
        
    } catch (error) {
        res.status(403).render('books/add',{book:req.body})   
    }
})
.delete(async(req,res)=>{
    try {
        await Book.findByIdAndRemove(req.params.id).exec()
        req.flash('success_msg','Successfuly  Book removed!')
        res.redirect('/')
    } catch (error) {
        res.status(500).render('error',{message:'Something Went Wrong',code:500})
        
    }
});

// edit book
router.get('/edit/:id',async(req,res)=>{
    try {
        const foundBook= await Book.findById(req.params.id).exec()
        res.render('books/edit',{book:foundBook})    
    } catch (error) {
        res.status(500).render('error',{message:'Something Went Wrong',code:500})
        
    }
})


//----------- books buffer and save handling
function saveCover(book,coverEncoded) {
    const allowedTypes=/png|jpeg|jpg|gif/
     let cover= JSON.parse(coverEncoded)
    if (allowedTypes.test(cover.type)) {
        // create buffer from data
        let buffer= new Buffer.from(cover.data,'base64')
        book.coverType=cover.type
        book.coverData=buffer
        // return book
    }
    else {
        throw new Error('No Cover Image Found!')
    }
}



module.exports= router