const request = require('supertest')
const {User} =require("../../models/user")

let server;
describe("/api/users",()=>{

    beforeEach(()=>{server = require("../../index");})
    afterEach( async ()=>{
            await User.remove({});
            await server.close();})

    describe("GET",()=>{
        it("should be return all user",async ()=>{
            await User.collection.insertMany([
                {
                    name:"user1",
                    email:"user1@domain.com",
                    password:"user1password"
                },
                {
                    name:"user2",
                    email:"user2@domain.com",
                    password:"user2password"
                }
            ]);
            const res = await request(server).get('/api/users');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        })
    })

    describe("POST",()=>{
        it("it should return 400 if user name is not given ",async ()=>{
            const user = {name:"",email:"user@domain.com",password:"userpassword"}
            const res = await request(server).post('/api/users').send(user);
            expect(res.status).toBe(400);
        });
        it("it should return 400 if user email is not given ",async ()=>{
            const user = {name:"user1",email:"",password:"userpassword"}
            const res = await request(server).post('/api/users').send(user);
            expect(res.status).toBe(400);
        });
        it("it should return 400 if user password is not given ",async ()=>{
            const user = {name:"user1",email:"user@domain.com",password:""}
            const res = await request(server).post('/api/users').send(user);
            expect(res.status).toBe(400);
        });
        it("it should return 400 if user already exist ",async ()=>{
            const userObject = {name:"user1",email:"user@domain.com",password:"userpassword"}
            const user = new User(userObject);
            await user.save()
            const res = await request(server).post('/api/users').send(user);
            expect(res.status).toBe(400);
        });
        it("it should return 400 if user already exist ",async ()=>{
            const user = {name:"user1",email:"user@domain.com",password:"userpassword"}
            const res = await request(server).post('/api/users').send(user);
            expect(res.status).toBe(200);
            expect(res.header).toHaveProperty('x-auth-token');
        });
    })
})