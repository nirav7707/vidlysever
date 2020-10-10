const Joi = require("joi")
const mongoose = require("mongoose")
const express = require("express")
const app = express()
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movie = require('./routes/movies');
const rental = require('./routes/rentals');

mongoose.connect('mongodb://localhost/vildy',{
	 useNewUrlParser: true,
	 useUnifiedTopology: true
})
	.then((db)=>console.log("connection succefull establish"))
  .catch(err=>console.log(err))
  

app.use(express.json())
app.use('/api/genres',genres)
app.use('/api/customers',customers)
app.use('/api/movies',movie)
app.use('/api/rentals',rental)

const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listening on port ${port}...`))
