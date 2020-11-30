
const usermanager = require("./usermanager"); 
var MongoClient = require('mongodb').MongoClient;

describe("user login", () => {
    let client; 
    let db;

    beforeAll(async() => {
        var url = "mongodb://localhost:27017";
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 

        await db.createCollection("users", function(err, res) {
            if(err) {throw err;}  
        });
        await db.createCollection("goals", function(err, res) {
            if(err) {throw err;}  
        });
        await client.close();
    });

    afterAll(async () => { 
        var url = "mongodb://localhost:27017";
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 
        await db.dropDatabase();
        client.close();
    });

    it("test login", async() => {
        var token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZGMwMTJkMDdmNTJhZWRmZDVmOTc3ODRlMWJjYmUyM2MxOTcyNGQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1MzQ4OTU1MzgxNTctc3UxMG80a2gyZ2N0OWVsZ2FhZmpnOW1uOTVmNWhsbW4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1MzQ4OTU1MzgxNTctMTdvMjJyM3RxN2ZuNmc2cG5ob2UwcnBsNHFza3E1bmcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ5NjI1NTQ3NDQ5MDcyNjk3MTEiLCJlbWFpbCI6ImFsYW4uc2h1eWFvd2VuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU2h1eWFvIHdlbiIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLW1IVHhRU0M3TkpzL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y2xGQ0xLRDFTQXdwX25KTHM2MTBaY3BHemhGWWcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlNodXlhbyIsImZhbWlseV9uYW1lIjoid2VuIiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE2MDYyNTk4NTMsImV4cCI6MTYwNjI2MzQ1M30.YRYRA9gJzadock4GPsdC3UXD_nA7MYTCrMJfRr08D-bVM3P82Ow4hyk-b2A-jUiMuWcH-lKrh9ZWwE2s7INwDewEiNuS7sWLnXyKxemXIYjNH3ouFMb4c2VOPk3IufpYpVq3RpB7sHMYO6bmuvTdepkEeYREPtMLtwF7awiIkwkziJu26UjRSNSnSBJajOoxW4ob757MOoGyzv1Kg_fbV-KfsOGZ62bm2j7TiFalz98ajPdMNAoT7l3e4Ku5nvOly75b7S6pJCpgxeE-aFD6odTYeSfnYAOk2XbJlNSBmmPsVQNYRqMAOOaZo5UQC-ox0epmZAX7dIJDUgNurLZmKQ"; 
        let err = await usermanager.login(token); 
        expect(err).toBe(1); 
    });

});

describe("send friend request", () => {
    let client; 
    let db;

    beforeAll(async() => {
        var url = "mongodb://localhost:27017";
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 

        await db.createCollection("users", function(err, res) {
            if(err) {throw err;}  
        });
        await db.createCollection("goals", function(err, res) {
            if(err) {throw err;}  
        });

        let newUser={
            "id":"testUser",
            "username":"John",
            "email":"cpen321@gmail.com",
            "firebase" : "placeholder1", 
            "friendslist":["NULL"],
            "pendingfriends" : ["NULL"], 
            "posts":["NULL"],
            "comments":["NULL"],
            "likes":["NULL"]
        };

        let newFriend={
            "id":"testUser1",
            "username":"Joe",
            "email":"cpen331@gmail.com",
            "firebase" : "placeholder2", 
            "friendslist":["NULL"],
            "pendingfriends" : ["NULL"], 
            "posts":["NULL"],
            "comments":["NULL"],
            "likes":["NULL"]
        };

        await db.collection("users").insertOne(newUser);
        await db.collection("users").insertOne(newFriend);
        await client.close(); 
    });

    it("send friend request", async() => {
        let token = await usermanager.sendRequest("cpen321@gmail.com", "cpen331@gmail.com"); 
        expect(token).toStrictEqual("placeholder2"); 
    }); 

}); 

describe("view all friend requests", () => {

    it("get all friend requests", async() => {
        let requests = await usermanager.getRequest("testUser1"); 
        let length = requests.length; 
        expect(length).toBe(1); 
    });

});

describe("confirm friend request", () => {
    it("confirm friend request invalid user", async() => {
        let err = await usermanager.confirmRequest("invalidUser", "cpen321@gmail.com"); 
        expect(err).toBe(1); 
    }); 

    it("confirm friend request", async() => {
        let err = await usermanager.confirmRequest("testUser1", "cpen321@gmail.com"); 
        expect(err).toBe(0); 
    }); 

    it("confirm friend request invalid email", async() => {
        let err = await usermanager.confirmRequest("testUser1", "cpen401@gmail.com"); 
        expect(err).toBe(0); 
    }); 

}); 

describe("get friends list", () => {
    it("get friends list", async() => {
        let friends = await usermanager.getFriends("testUser"); 
        let length = friends.length;
        expect(length).toBe(1); 
    }); 

});

describe("deny friends request", () => {
    it("deny friend request", async() => {
        await usermanager.sendRequest("cpen321@gmail.com", "cpen331@gmail.com"); 
        let err = await usermanager.denyRequest("testUser1", "cpen321@gmail.com"); 
        expect(err).toBe(0); 
    }); 

    it("deny friend request invalid user", async() => {
        await usermanager.sendRequest("cpen321@gmail.com", "cpen331@gmail.com"); 
        let err = await usermanager.denyRequest("testUser2", "cpen321@gmail.com"); 
        expect(err).toBe(1); 
    }); 

    it("deny friend request invalid email", async() => {
        let err = await usermanager.confirmRequest("testUser1", "cpen401@gmail.com"); 
        expect(err).toBe(0); 
    }); 

}); 

describe("update firebase token", () => {

    afterAll(async () => {
        var url = "mongodb://localhost:27017";
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 
        await db.dropDatabase();
        client.close();
    });

    it("update firebase toke of testUser", async() => {
        let err = await usermanager.firebase("testUser", "fbtoken"); 
        expect(err).toBe(0); 
    });
    
});