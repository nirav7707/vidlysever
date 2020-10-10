const mongoose = require('mongoose')
const Joi = require("joi")

const genreSchema = new mongoose.Schema({
    name:{
      type:String,
      required:true
    }
})

  
  
function validateGenre(genre){
      const schema = {
          name : Joi.string().min(3).required()
        };
        return Joi.validate(genre,schema);
}
    
    
const Genre = mongoose.model('Genre',genreSchema);

module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
module.exports.genreSchema =genreSchema;