const Joi = require("joi")
const config = require("config")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const express = require("express")
const mongoose = require("mongoose")
const {User} = require('../models/user');
const { JsonWebTokenError } = require("jsonwebtoken");
const router = express.Router();


router.post('/',async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send("Invalid Email Or Password")

    const validPassword = await bcrypt.compare(req.body.password,user.password)
    if(!validPassword) return res.status(400).send("Invalid Email Or Password")
    
    const token = user.generateAuthToken();
    res.send(token);
})

function validate(user){
    const Schema={
        email:Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(8).max(255).required()        
    };
    return Joi.validate(user,Schema);
}
module.exports = router;