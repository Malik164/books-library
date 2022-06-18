const mongoose = require('mongoose')
const bycrypt= require('bcryptjs')
const userSchema=new mongoose.Schema({
    uname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
            type:String,
            required:true,
            trim:true,
            validate:{
                validator:val=> /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
                message:props=> `${props.value} is not a valid email!`
            }
    },
    password:{
        type:String,
        required:true
    }
})

// method that hash the password
userSchema.methods.hashPassword=async function () {
    try {
        const genSalt = await bycrypt.genSalt(10)
        const hash= await bycrypt.hash(this.password,genSalt)
        return hash
    } catch (error) {
        console.log(error);
    }
}

// method that compare the  typed password with hash
userSchema.methods.comparePassword=async function(input_password) {
    try {

        return await bycrypt.compare(input_password,this.password)
    } catch (error) {
        console.log(error);
    }
}


module.exports=mongoose.model('User',userSchema)

