const {Movie,validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre');
const mongoose =  require('mongoose');
const express = require("express")
const router = express.Router();

router.get('/', async (req,res) =>{
    const movie = await Movie.find();
    res.send(movie)
});

router.post('/', async (req,res)=>{
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send("Invalid Id");

    let movie = new Movie({
        title : req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    });

movie = await movie.save();

res.send(movie)

})

module.exports = router;