const _ = require("lodash");
const bcrypt = require("bcrypt")
const express = require("express")
const mongoose = require("mongoose")
const {User,validateUser} = require('../models/user');
const router = express.Router();

router.get('/', async(req,res)=>{
    const users = await User.find();
    res.send(users)
})

router.post('/',async(req,res)=>{
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email:req.body.email})
    if(user) return res.status(400).send("user already registered")

    let userinfo = req.body;
    const salt = await bcrypt.genSalt(10);
    userinfo.password = await bcrypt.hash(req.body.password,salt)

    user = await User.create(userinfo);
    
    res.send(_.pick(user , ['_id','name','email']))
})

module.exports = router;