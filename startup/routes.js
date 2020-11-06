const express = require("express")
const error = require("../middleware/error")
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movie = require('../routes/movies');
const rental = require('../routes/rentals');
const user = require('../routes/users');
const auth = require('../routes/auth');
const returns =  require('../routes/returns');

module.exports =  function(app){
app.use(express.json());
app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movie);
app.use('/api/rentals',rental);
app.use('/api/users',user);
app.use('/api/login',auth);
app.use('/api/returns',returns);
app.use(error);
}