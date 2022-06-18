const mongoose= require('mongoose')

const bookSchema=new mongoose.Schema({
    title:{
       type:String,
       required:true,
       trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
     },
     coverType:{
         type:String,
         required:true
     },
     coverData:{
        type:Buffer,
        required:true
     },
     author:{
        type:String,
        required:true,
        trim:true,
   
     },
     pages:{
        type:Number,
        required:true
     },
     createdAt:{
        type:Date,
        default:Date.now
     }
})

// virtual property  for image path
bookSchema.virtual('image_path')
.get(function() {
   // if a book exists
   if(this.coverType!=null && this.coverData!=null)
   return `data:${this.coverType};charset=utf-8;base64,${this.coverData.toString('base64')}`
})
module.exports= mongoose.model('Book',bookSchema)