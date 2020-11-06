const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validate = require("../middleware/validateObjectid")
const mongoose = require('mongoose')
const express = require('express')
const Joi = require("joi")
const router = express.Router()
const {Genre,validateGenre} = require('../models/genre')
const validatefunction = require('../middleware/validate');


router.get('/',async (req,res)=>{
  // throw new Error("Could not get the genres.")
  const genre = await Genre.find();
  res.send(genre);
})

router.post('/',[auth,validatefunction(validateGenre)],async (req,res)=>{
  // const {error} = validateGenre(req.body);
  // if(error) return res.status(400).send(error.details[0].message);

  let genre = await Genre.create(req.body);
  res.send(genre)
});

router.put('/:id',auth,async (req,res)=>{
  const {error} = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{
    new:true
  })

  if(!genre) return res.status(400).send('the genre with the given ID')
  res.send(genre);

});


router.delete('/:id',[auth,admin], async (req,res)=>{
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if(!genre) return res.status(404).send('The genre with the given ID');
  res.send(genre);
});

router.get('/:id',validate,async(req,res)=>{
  const genre = await Genre.findById(req.params.id)
  if(!genre) return res.status(404).send('The genre with the given ID')
  res.send(genre);
});



module.exports = router;
