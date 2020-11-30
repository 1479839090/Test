const goalmanager = require("./goalmanager");
var MongoClient = require("mongodb").MongoClient;

describe("create goal test", () => {
    let client; 
    let db;

    beforeAll(async() => {
        var url = "mongodb://localhost:27017";
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 
        let newUser={
            "id":"testUser",
            "username":"John",
            "email":"cpen321@gmail.com",
            "firebase" : "", 
            "friendslist":["NULL"],
            "pendingfriends" : ["NULL"], 
            "posts":["NULL"],
            "comments":["NULL"],
            "likes":["NULL"]
        };

        await db.createCollection("users", function(err, res) {
            if(err) {throw err;}  
        });
        await db.createCollection("goals", function(err, res) {
            if(err) {throw err;}  
        });
        
       await db.collection("users").insertOne(newUser); 
       await client.close(); 
    });

    it("create goal with proper format", async() => {
        var milestones = ["Run 500m", "Run 1000m", "Run 10000m"];
        var schedule = ["December 1, 2020", "October 2, 2021", "November 3, 2021"];
        var userid = "testUser";
        var title = "testGoal";
        var author = "John";
        var content = "Just a test";
        var tag = "test"; 

        let result = await goalmanager.create(userid, title, author, content, milestones, schedule, tag); 
        expect(result).toBe(0); 
    });

    it("create goal with null user", async() => {
        var milestones = ["Run 500m", "Run 1000m", "Run 10000m"];
        var schedule = ["December 1, 2020", "October 2, 2021", "November 3, 2021"];
        var userid = null;
        var title = "testGoal";
        var author = "John";
        var content = "Just a test";
        var tag = "test"; 

        let result = await goalmanager.create(userid, title, author, content, milestones, schedule, tag); 
        expect(result).toBe(1); 
    });

});

describe("update like and comment test", () => {

    it("update testGoal index", async() => {
        let result = await goalmanager.update("testUsertestGoal", 1); 
        expect(result).toBe(0); 
    });

    it("update testGoal invalid index", async() => {
        let result = await goalmanager.update("testUsertestGoal", 6); 
        expect(result).toBe(1); 
    });

    it("like testGoal as testUser", async() => {
        let result = await goalmanager.like("testUser", "testUsertestGoal"); 
        expect(result).toBe(0); 
    });

    it("like testGoal as non-existent user", async() => {
        let result = await goalmanager.like("testUser2", "testUsertestGoal"); 
        expect(result).toBe(1); 
    });

    it("comment testGoal as testUser", async() => {
        let result = await goalmanager.comment("testUser", "testUsertestGoal", "test comment"); 
        expect(result).toBe(0); 
    });

    it("comment testGoal as non-existent user", async() => {
        let result = await goalmanager.comment("testUser0", "testUsertestGoal", "test comment"); 
        expect(result).toBe(1); 
    });


});

describe("view goals & feed tests", () => {
    let client; 
    let db;

    beforeAll(async() => {
        var url = "mongodb://localhost:27017";
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 
        let newUser={
            "id":"testUser",
            "username":"John",
            "email":"cpen321@gmail.com",
            "firebase" : "", 
            "friendslist":["NULL", "testUser1"],
            "pendingfriends" : ["NULL"], 
            "posts":["NULL", "test1"],
            "comments":["NULL", "test1"],
            "likes":["NULL", "test1"]
        };

        let newFriend={
            "id":"testUser1",
            "username":"Joe",
            "email":"cpen331@gmail.com",
            "firebase" : "", 
            "friendslist":["NULL", "testUser"],
            "pendingfriends" : ["NULL"], 
            "posts":["NULL", "test1"],
            "comments":["NULL"],
            "likes":["NULL"]
        };

        let testGoal = {id: "test1",
        "title" : "I want to pass CPEN 331", 
        "author" : "Eric", 
        "date" : "October 22, 2020",
        "content" : "The class is extremely difficult. I will try my best to pass the course and not fail or get depression", 
        "milestones" : [],
        "schedule" : [], 
        "tag" : "undergraduate",
        "comments" : ["Good Job", "I hope I pass too"], 
        "likes" : 12,
        "index": 0 
        };     

       await db.collection("users").deleteMany({}); 
       await db.collection("goals").deleteMany({});
        
       await db.collection("users").insertOne(newUser); 
       await db.collection("users").insertOne(newFriend); 
       await db.collection("goals").insertOne(testGoal); 
       await client.close(); 
    });

    afterAll(async () => {
        var url = "mongodb://localhost:27017";
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 
        await db.dropDatabase();
        client.close();
    });

    it("view all goals of test user", async() => {
        
        let result = await goalmanager.viewAll("testUser"); 
        let length = result.length; 
        expect(length).toBe(1); 
    });

    it("view feed of test user", async() => {
        
        let result = await goalmanager.viewFeed("testUser"); 
        let length = result.length; 
        expect(length).toBe(1); 
    });

});
