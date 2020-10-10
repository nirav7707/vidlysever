
const express = require('express')
const router = express.Router()
const {Customer,validateCustomer} = require('../models/customer')

router.get('/',async (req,res)=>{
  const customer = await Customer.find();
  res.send(customer);
})

router.post('/',async (req,res)=>{
  const {error} = validateCustomer(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.create(req.body);
  res.send(customer)
});



module.exports = router;