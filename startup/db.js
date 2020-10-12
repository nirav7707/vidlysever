const winston = require('winston')
const mongoose = require("mongoose")

module.exports = function(){
    mongoose.connect('mongodb://localhost/vidly',{
	 useNewUrlParser: true,
	 useUnifiedTopology: true
})
	.then((db)=>winston.info("connection succefull establish"))

}