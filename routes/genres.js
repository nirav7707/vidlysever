const mongoose = require('mongoose')
const express = require('express')
const Joi = require("joi")
const router = express.Router()

const Genre = mongoose.model("Genre",new mongoose.Schema({
  name:{
    type:String,
    required:true,
    minlength:5,
    maxlength:50
  }
}));


router.get('/',async (req,res)=>{
  const genre = await Genre.find();
  res.send(genre);
})

router.post('/',async (req,res)=>{
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({name:req.body});
  genre = await genre.save();
  res.send(genre)
});

router.put('/:id',async (req,res)=>{
  const {error} = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const genre = Genre.findByIdAndUpdate(req.params.id,{name:req.body},{
    new:true
  })

  if(!genre) return res.status(400).send('the genre with the given ID')
  res.send(genre);

});


router.delete('/:id', async (req,res)=>{
  const genre = Genre.findByIdAndRemove(req.params.id);
  if(!genre) return res.status(404).send('The genre with the given ID');
  res.send(genre);
});

router.get('/:id',async(req,res)=>{
  const genre = await Genre.findById(req.params.id)
  if(!genre) return res.status(404).send('The genre with the given ID')
  res.send(genre);
});


function validateGenre(genre){
  const schema = {
    name : Joi.string().min(3).required()
  };
  return Joi.validate(genre,schema);
}


module.exports = router;
