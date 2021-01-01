const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:1,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    isAdmin:{
        type:Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id,name:this.name,isAdmin:this.isAdmin},config.get('jwtPrivateKey'))
    return token;
}
const User = mongoose.model('user',userSchema);

function validateUser(user){
    const Schema = {
        name:Joi.string().min(1).max(50).required(),
        email:Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(8).max(255).required()
    }

    return Joi.validate(user,Schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;