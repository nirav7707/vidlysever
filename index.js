const Joi = require("joi")
const config = require("config")
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require("mongoose")
const express = require("express")
const app = express()
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movie = require('./routes/movies');
const rental = require('./routes/rentals');
const user = require('./routes/users');
const auth = require('./routes/auth');

if (!config.get("jwtPrivateKey")){
	console.log("FATAL ERROR : jwtPrivateKey is not defined.")
	process.exit(1);
}

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
app.use('/api/users',user)
app.use('/api/login',auth)

const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listening on port ${port}...`))
