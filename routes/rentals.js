const {Rental,validateRental} = require('../models/rental');
const {Movie} = require('../models/movie')
const {Customer} = require("../models/customer")
const express = require("express")
const mongoose = require("mongoose")
const Fawn = require("fawn")
const router = express.Router()

Fawn.init(mongoose);

router.get('/',async (req,res)=>{
    const rental = await Rental.find().sort(-dateOut);
    res.send(rental);
})

router.post('/',async (req,res)=>{
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer ID");

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send("Invalid movie ID")

    if(movie.numberInStock === 0) return res.status(400).send("Movie not in stock")

    let rental = new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
    });

    try{
        new Fawn.Task()
        .save('rentals',rental)
        .update('moives',{_id:movie._id},{
            $inc:{numberInStock:-1}
        })
        .run()

    res.send(rental);
    }
    catch(ex){
        res.status(500).send("somthing wrong")
    }

})

module.exports = router;