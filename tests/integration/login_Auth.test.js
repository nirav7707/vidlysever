const request = require('supertest');
const {User} =require('../../models/user');

let server;
describe("login authentication",()=>{

    beforeEach(()=>{
        server = require('../../index');
    });
    afterEach(async ()=>{
        await User.remove({});
        await server.close();
    });

    it("it should retrun 400 if user email is lessthen 5 character",async ()=>{
        const user = {email:"",password:"userpassword"};
        const res =await request(server).post('/api/login').send(user);
        expect(res.status).toBe(400);
    });
    it("it should retrun 400 if password email is lessthen 8 character",async ()=>{
        const user = {email:"user@domain.com",password:""};
        const res =await request(server).post('/api/login').send(user);
        expect(res.status).toBe(400);
    });
    it("it should retrun 400 if password user email is not match",async ()=>{
        const userObject = {email:"user1@domain.com",password:"userpassword"};
        const user = new User({name:"user1",email:"user@domain.com",password:"userpassword"});
        await user.save();
        const res =await request(server).post('/api/login').send(userObject);
        expect(res.status).toBe(400);
    });
    it("it should retrun 400 if password user password is not match",async ()=>{
        const userObject = {email:"user@domain.com",password:"user1password"};
        const user = new User({name:"user1",email:"user@domain.com",password:"userpassword"});
        await user.save();
        const res =await request(server).post('/api/login').send(userObject);
        expect(res.status).toBe(400);
    });
    it("it should retrun 200 if res receive token",async ()=>{
        // const userObject = {name:"user1",email:"user@domain.com",password:"passwordforuser1"};
        const user = new User({name:"user1",email:"user@domain.com",password:"passwordforuser1"});
        await user.save();
        const res =await request(server).post('/api/login').send({email:"user@domain.com",password:"passwordforuser1"});
        expect(res.body).not.toBeNull();
        console.log("this is res.body part",res.error.text);
        expect(res.status).toBe(200);
    });
})