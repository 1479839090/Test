const supertest = require("supertest");
const app = require("./main");
const request = supertest(app); 

describe("view goals", () => {

    let db; 
    let client; 

    beforeAll( async() => {
        var MongoClient = require("mongodb").MongoClient;
        var url = "mongodb://localhost:27017";
        
        let user = {
            "id":"123",
            "username":"John",
            "email":"cpen321@gmail.com",
            "firebase" : "placeholder1", 
            "friendslist":["0"],
            "pendingfriends" : ["NULL"], 
            "posts":["NULL", "test1"],
            "comments":["NULL", "test2"],
            "likes":["NULL", "test3"]
        };

        let newUser = {
            "id":"321",
            "username":"Joe",
            "email":"cpen331@gmail.com",
            "firebase" : "placeholder", 
            "friendslist":["0"],
            "pendingfriends" : ["NULL"], 
            "posts":["NULL"],
            "comments":["NULL"],
            "likes":["NULL"]
        };

        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = client.db("GoalStarter"); 
        await db.dropDatabase();
        db = client.db("GoalStarter"); 

       
        

        await db.collection("users").insertOne(user); 
        await db.collection("users").insertOne(newUser);
        await client.close(); 
    }); 

    it("user with posts", async () => {
        const response = await request.get("/home/view_goals/123"); 
      
        expect(response.status).toBe(200); 
    });

    it("user no posts", async () => {
        const response = await request.get("/home/view_goals/321"); 
      
        expect(response.status).toBe(200); 
    });

}); 

describe("send friend request", () => {

    it("user sends newUser friends request",async () => {
        const body={ 
            userEmail : "cpen321@gmail.com",
            email : "cpen331@gmail.com"
        };
        await request.post("/home/send_requests").send(body).expect(200);
    });     
}); 

describe("view and accept friend requests", () => {

    it("newUser view friend request ", async()=>{
        const response= await request.get("/home/pending/321");
        expect(response.status).toBe(200);  
    });

    it("newUser accepts friend request", async()=>{
        const body={ 
            email : "cpen321@gmail.com"
        }
        await request.put("/home/confirm_requests/321").send(body).expect(200);
    });     

    it("invalid user accepts friend request", async()=>{
        const body={ 
            email : "cpen321@gmail.com"
        }
        await request.put("/home/confirm_requests/322").send(body).expect(200);
    });    

    it("user accepts friend request invalid email", async()=>{
        const body={ 
            email : "cpen401@gmail.com"
        }
        await request.put("/home/confirm_requests/321").send(body).expect(200);
    }); 
})

describe("view friends list", () => {
    it("check user friends list", async()=>{
        const response= await request.get("/home/friendslist/123");
        expect(response.status).toBe(200);    
    })
}); 

describe("create goal", () => {
    it("newUser creates goal proper format", async() => {
        const body={ 
            milestones : ["Run 500m", "Run 1000m", "Run 10000m"],
            schedule : ["December 1, 2020", "October 2, 2021", "November 3, 2021"],
            userid : "321",
            title : "testGoal",
            author : "John",
            content : "Just a test",
            tag : "test"
        }
        await request.post("/home/create_goal/321").send(body).expect(200);
    });

    it("user creates goal improper format", async() => {
        const body={ 
            milestones : ["Run 500m", "Run 1000m", "Run 10000m"],
            schedule : ["December 1, 2020", "October 2, 2021", "November 3, 2021"],
            userid : "321",
            title : null,
            author : "John",
            content : "Just a test",
            tag : "test"
        }
        await request.post("/home/create_goal/321").send(body).expect(400);
    });
}); 

describe("get user feed", () => {
    it("view user feed", async()=>{
        const response= await request.get("/home/123");
        expect(response.status).toBe(200); 
    })
});

describe("update goals tests", () => {

    it("update goal index", async() => {
        const update={ 
            id : "test1",
            index : 1 
        }
        await request.put("/home/update").send(update).expect(200);
    }); 

    it("update goal invalid index", async() => {
        const update={ 
            id : "test1",
            index : 5 
        }
        await request.put("/home/update").send(update).expect(200);
    }); 


    it("like a goal", async() => {
        const like={ 
            id : "test2",
        }
        await request.put("/home/like/123").send(like).expect(200);
    }); 

    it("like a goal as non-existant user", async() => {
        const like={ 
            id : "test5",
        }
        await request.put("/home/like/123").send(like).expect(200);
    }); 

    it("comment on a goal", async() => {
        const like={ 
            id : "test3",
            comment : "test comment",
            author : "123"
        }
        await request.put("/home/comment/123").send(like).expect(200);
    }); 

    it("comment on a goal as non-existent user", async() => {
        const like={ 
            id : "test5",
            comment : "test comment",
            author : "123"
        }
        await request.put("/home/comment/123").send(like).expect(200);
    });
}); 

describe("update user firebase token", () => {

    it("update firebase of user", async() => {
        const body={ 
            token : "122323232323" 
        }
        await request.put("/home/firebase/123").send(body).expect(200);
    }); 
}); 

describe("deny friend request", () => {

    beforeAll(async() => {
        var url = "mongodb://localhost:27017";
        var MongoClient = require("mongodb").MongoClient;
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 

        await db.collection("users").updateOne({"id" : "321"}, {$push: {
            "pendingfriends": "cpen321@gmail.com"
        }});
        client.close();
    }); 

    it("newUser deny friend request from user", async() => {
        const body={ 
            email : "cpen321@gmail.com"
        }
        await request.put("/home/deny_requests/321").send(body).expect(200);
    }); 

    it("invalid deny friend request from user", async() => {
        const body={ 
            email : "cpen321@gmail.com"
        }
        await request.put("/home/deny_requests/456").send(body).expect(200);
    }); 

    it("newUserdeny friend request invalid email", async() => {
        const body={ 
            email : "cpen401@gmail.com"
        }
        await request.put("/home/deny_requests/321").send(body).expect(200);
    }); 
}); 

describe("login test", () => {
    afterAll(async () => {
        var url = "mongodb://localhost:27017";
        var MongoClient = require("mongodb").MongoClient;
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = await client.db("GoalStarter"); 
        await db.dropDatabase();
        client.close();
    });

    it("login", async() => {
        const body={ 
            idToken : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZGMwMTJkMDdmNTJhZWRmZDVmOTc3ODRlMWJjYmUyM2MxOTcyNGQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1MzQ4OTU1MzgxNTctc3UxMG80a2gyZ2N0OWVsZ2FhZmpnOW1uOTVmNWhsbW4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1MzQ4OTU1MzgxNTctMTdvMjJyM3RxN2ZuNmc2cG5ob2UwcnBsNHFza3E1bmcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ5NjI1NTQ3NDQ5MDcyNjk3MTEiLCJlbWFpbCI6ImFsYW4uc2h1eWFvd2VuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU2h1eWFvIHdlbiIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLW1IVHhRU0M3TkpzL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y2xGQ0xLRDFTQXdwX25KTHM2MTBaY3BHemhGWWcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlNodXlhbyIsImZhbWlseV9uYW1lIjoid2VuIiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE2MDYyNTk4NTMsImV4cCI6MTYwNjI2MzQ1M30.YRYRA9gJzadock4GPsdC3UXD_nA7MYTCrMJfRr08D-bVM3P82Ow4hyk-b2A-jUiMuWcH-lKrh9ZWwE2s7INwDewEiNuS7sWLnXyKxemXIYjNH3ouFMb4c2VOPk3IufpYpVq3RpB7sHMYO6bmuvTdepkEeYREPtMLtwF7awiIkwkziJu26UjRSNSnSBJajOoxW4ob757MOoGyzv1Kg_fbV-KfsOGZ62bm2j7TiFalz98ajPdMNAoT7l3e4Ku5nvOly75b7S6pJCpgxeE-aFD6odTYeSfnYAOk2XbJlNSBmmPsVQNYRqMAOOaZo5UQC-ox0epmZAX7dIJDUgNurLZmKQ"
        }
        await request.post("/home/create_goal/321").send(body).expect(400);
    }); 
}); 

