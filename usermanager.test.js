
const usermanager = require("./usermanager"); 
var MongoClient = require("mongodb").MongoClient;


describe("send friend request", () => {
    let client; 
    let db;

    beforeAll(async() => {
        var url = "mongodb://localhost:27017";
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 
        db.dropDatabase();
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