const  {Rental} = require('../../models/rental');
const  {Movie} = require('../../models/movie');
const moment = require('moment')
const mongoose =  require('mongoose');
const request = require('supertest');
const {User} =require('../../models/user')

describe("",()=>{
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec =  () =>{
        return request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({customerId,movieId});
    };
    beforeEach(async ()=>{
        server = require('../../index')
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()
        token  = new User().generateAuthToken()
        movie = new Movie({
            _id:movieId,
            title:'1234567',
            dailyRentalRate: 2,
            genre:{name:'123456'},
            numberInStock:10
        });

        await movie.save();

        rental = new Rental({
            customer:{
                _id:customerId,
                name:"12345678",
                phone:"12345678"
            },
            movie:{
                _id:movieId,
                title:"12345",
                dailyRentalRate:2
            }
        });
        await rental.save();
    });
    afterEach(async ()=>{
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it("should be return 401 if client is not logged in",async ()=>{
            token = ""
            const res = await exec();
            expect(res.status).toBe(401);
    });
    it("should be return 400 if coustomer id is not provided",async ()=>{
        customerId = "";

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it("should be return 400 if movie id is not provided",async ()=>{
        movieId = "" ;
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should be return 404 if given movie id or customer id in not found",async ()=>{
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it("should be return 400 if return is already processed",async ()=>{
        rental.dateReturned = new Date();
        await rental.save()
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should be return 200 if we have valid request",async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it("should be return 200 if we have valid request",async ()=>{
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
    it("should set the rentalFee if input is valid",async ()=>{

        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save()

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });
    it("should set the rentalFee if input is valid",async ()=>{

        const res = await exec();
        const movieId = await Movie.findById(movie._id);
        expect(movieId.numberInStock).toBe(movie.numberInStock +1 );
    });
    it("should return rental in bosy",async ()=>{

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','movie']));
    });

});