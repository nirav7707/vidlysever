const mongoose = require('mongoose')
const Joi = require("joi")


const Customer = mongoose.model('Customer',new mongoose.Schema({
    name:{
      type:String,
      required:true
    },
    isGold:{
        type:Boolean,
        required:true
    },
    phone:{
      type:String,
      required:true
    }
  }));


function validateCustomer(customer){
    const schema = {
      name : Joi.string().min(3).required(),
      isGold : Joi.boolean().required(),
      phone : Joi.string().min(3).required()
    };
    return Joi.validate(customer,schema);
  }


module.exports.Customer = Customer
module.exports.validateCustomer =validateCustomer