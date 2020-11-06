const auth = require('../middleware/auth')
const validate = require('../middleware/validate')

const express = require('express')
const router = express.Router()
const {Customer,validateCustomer} = require('../models/customer')

router.get('/',async (req,res)=>{
  const customer = await Customer.find();
  res.send(customer);
})

router.post('/',[auth,validate(validateCustomer)],async (req,res)=>{


  let customer = await Customer.create(req.body);
  res.send(customer)
});



module.exports = router;