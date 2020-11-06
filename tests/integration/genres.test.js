const  request  = require("supertest");
const {Genre} = require("../../models/genre")
const {User} = require('../../models/user')
const mongoose = require('mongoose')
let server;

describe("/api/genres",()=>{
    
    beforeEach(()=>{server = require("../../index");})
    afterEach( async ()=>{
        await Genre.remove({});
        await server.close();})

    describe("GET/",()=>{
        
        it("should return all genres", async ()=>{
            await Genre.collection.insertMany([
                {name:"genre1"},
                {name:"genre2"}
            ])
            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name==="genre1")).toBeTruthy();
            expect(res.body.some(g => g.name==="genre1")).toBeTruthy();

        })

    })
    
    describe("GET /:id",()=>{
        it("should return 200 for given id", async ()=>{
            const genre = new Genre({name:"genre1"})
            await genre.save();
            const res = await request(server).get("/api/genres/"+genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name);
        });
        it("should return 404 for given id which is not in database", async ()=>{
            const res = await request(server).get("/api/genres/1");
            expect(res.status).toBe(404);
        });
        it("should return 404 for given id which is not in database", async ()=>{
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get("/api/genres/"+id);
            expect(res.status).toBe(404);
        });
    })
    describe("POST /", ()=>{

        let token;
        let name;
        const exec = async ()=>{
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token',token)
                .send({name})
        }

        beforeEach(()=>{
            token = new User().generateAuthToken()
            name='genre1'
        })

        it("it should return 401 if cline is not looged in",async ()=>{
            token = ''
            const res = await exec();
            expect(res.status).toBe(401)
        });
        it("it should return 400 if genre is lessthen 5 character",async ()=>{
            name="12"
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it("it should return 400 if genre is morethen 50 character",async ()=>{
            name="12345678901234567890123456789012345678901234567890123456789012345678901234567890"
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it("it should return 200 if genre is valid",async ()=>{
            const res = await exec()
            const genre = await Genre.findOne({name:'genre1'})
            expect(genre).not.toBeNull();
            expect(res.status).toBe(200);
        });
        it("it should return 200 if genre is valid",async ()=>{
            const res = await exec();
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name','genre1')
        });
    })

    describe("DELETE /",()=>{
        // it("should 401 is user not logged in")
        afterEach(async ()=>{
            await Genre.remove({});
            await server.close();
        })

        it("should be return 404 if genre id is invalid",async()=>{
            const id = mongoose.Types.ObjectId();
            const user = {_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true}
            const token = new User(user).generateAuthToken();
            const res =await request(server)
                        .delete(`/api/genres/${id}`)
                        .set('x-auth-token',token)
                        .send({});
            expect(res.status).toBe(404);
        })

        it("should be return 403 if user is not admin",async()=>{
            const id = mongoose.Types.ObjectId();
            const user = {_id:mongoose.Types.ObjectId().toHexString(),isAdmin:false}
            const token = new User(user).generateAuthToken();
            const res =await request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token',token)
                .send({});
            expect(res.status).toBe(403);
        })
        it("should be return 404 if genre id is invalid",async()=>{
            const id = mongoose.Types.ObjectId();
            const user = {_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true}
            const genre = new Genre({name:"genre1"});
            await genre.save();
            const token = new User(user).generateAuthToken();
            const res = await request(server)
                .delete(`/api/genres/${genre._id}`)
                .set('x-auth-token',token)
                .send({});
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name",genre.name)
        })
    })

    describe("PUT /", ()=>{

        let token;
        let name;
        const exec = async (id)=>{
            return await request(server)
                .put('/api/genres/'+id)
                .set('x-auth-token',token)
                .send({name})
        }

        beforeEach(()=>{
            token = new User().generateAuthToken()
            name='genre1'
        })

        it("it should return 401 if cline is not looged in",async ()=>{
            token = ''
            const genre = new Genre({name:"genre1"});
            await genre.save();
            const res = await exec(genre.id);
            expect(res.status).toBe(401)
        });
        it("it should return 400 if genre is lessthen 5 latters",async ()=>{
            name="12"
            const genre = new Genre({name:"genre1"});
            await genre.save();
            const res = await exec(genre.id);
            expect(res.status).toBe(400)
        });
        it("it should return 400 if genre is not excist",async ()=>{
            name="123456"
            const id =mongoose.Types.ObjectId();
            const genre = new Genre({name:"genre1"});
            await genre.save();
            const res = await exec(id);
            expect(res.status).toBe(400)
        });
        it("it should return 200 if genre is excist",async ()=>{
            name="123456"
            const genre = new Genre({name:"genre1"});
            await genre.save();
            const res = await exec(genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',name);
        });
    })
})