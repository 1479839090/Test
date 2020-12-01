
async function login(token) {
    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017";
    var {AudienceClientID,googleClient}=require("./app");
    var err = 0; 

    let newUser={
        "id":"",
        "username":"",
        "email":"",
        "firebase" : "", 
        "friendslist":["NULL"],
        "pendingfriends" : ["NULL"], 
        "posts":["NULL"],
        "comments":["NULL"],
        "likes":["NULL"]
    };

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: AudienceClientID
        }); 

        const payload = ticket.getPayload();

        newUser.id = ticket.getUserId();
        newUser.email= payload["email"];    
        newUser.username= payload["name"];
    }
    catch (error) {
        
       err = 1; 
    }

    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter"); 

    let result= await db.collection("users").findOne({"id":newUser.id});
    if(result==null){ 
        await db.collection("users").insertOne(newUser);
    } 
    client.close();

    if(err > 0) {
        return err;} 
    return newUser; 
}

async function getFriends(userid) { 
    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017";
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter");
    var friends = []; 

    let user = await db.collection("users").findOne({"id" : userid});
    let friendsId = user.friendslist; 

    for(var i = 1; i < friendsId.length; i++) {
        let friend = await db.collection("users").findOne({"id" : `${friendsId[i]}`});
        let name = friend.username; 
        friends.push(name); 
    }

    client.close(); 

    return friends; 
}

async function getRequest(userid) { 
    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017";
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter");

    let user = await db.collection("users").findOne({"id" : userid});
    let requests = user.pendingfriends; 

    requests.pop(); 

    client.close(); 
    return requests; 
}

async function confirmRequest(userid, senderEmail) {
    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017";
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter");

    let user = await db.collection("users").findOne({"id" : userid});
    if(user == null) {
        
        return 1;
    }
    let requests = user.pendingfriends; 
    
    for(var i = 1; i < requests.length; i++) {
        if(`${requests[i]}` === senderEmail) {
            
            await db.collection("users").updateOne({"id" : userid}, {$pull: {
                "pendingfriends": senderEmail
            }});
            let sender = await db.collection("users").findOne({email : senderEmail});
            let senderId = sender.id; 
            await db.collection("users").updateOne({"id" : userid}, {$push: {
                "friendslist": senderId
            }});
            await db.collection("users").updateOne({"id" : senderId}, {$push: {
                "friendslist": userid 
            }});
        }
    }


    client.close(); 
    return 0; 
}

async function sendRequest(senderEmail, recieverEmail) {

    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017";
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter"); 

    let reciever = await db.collection("users").findOne({"email" : recieverEmail});  
    let token = reciever.firebase; 

    await db.collection("users").updateOne({"email" : recieverEmail}, {$push: {
        "pendingfriends": senderEmail
    }});

    client.close(); 
    return token; 
}

async function firebase(userid, token) {

    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017";
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter");

    await db.collection("users").updateOne({"id" : userid}, {$set: {
        "firebase": token
    }});

    client.close(); 
    return 0; 
}

async function denyRequest(userid, senderEmail) {
    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017";
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter");

    let user = await db.collection("users").findOne({"id" : userid});
    if(user == null) {
        
        return 1; 
    }
    let requests = user.pendingfriends; 
 
    for(var i = 1; i < requests.length; i++) {
       
        if(`${requests[i]}` === senderEmail) {
           
            await db.collection("users").updateOne({"id" : userid}, {$pull: {
                "pendingfriends": senderEmail
            }});
        }
    }

    client.close(); 
    return 0; 
}

module.exports = {
    login, 
    getRequest,
    confirmRequest, 
    denyRequest, 
    sendRequest, 
    getFriends,
    firebase
};

