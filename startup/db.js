const winston = require('winston')
const mongoose = require("mongoose")
const config = require("config")

module.exports = function(){
	const dbs = config.get('db')
    mongoose.connect(dbs,{
	 useNewUrlParser: true,
	 useUnifiedTopology: true
})
	.then((db)=>winston.info(`connectrd to ${dbs}`))

}