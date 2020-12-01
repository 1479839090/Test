//database
var MongoClient = require("mongodb").MongoClient;

//route handling
var express = require("express"); 

//push notifications
var bodyParser = require("body-parser");

//app utilities 
var goalmanager = require("./goalmanager");
var usermanager = require("./usermanager"); 

var app = express();

app.use(express.json()); 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var url = "mongodb://localhost:27017";

//create database and collections for the app. 
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, async function(err, client) {

    var db = client.db("GoalStarter"); 
    db.createCollection("users", function(err, res) {
    });
    db.createCollection("goals", function(err, res) {
    });

    client.close(); 
});

app.get("/home/:userid", async (req, res) => {
   var userid = req.params.userid; 
   var limit = 10; 
   var feed = await goalmanager.viewFeed(userid, limit);  

   res.send(feed); 
});

app.get("/home/friendslist/:userid", async (req, res) => {
    var userid = req.params.userid; 
    let friends = await usermanager.getFriends(userid); 
    res.send(friends); 
});

app.get("/home/pending/:userid", async (req, res) => {
    var userid = req.params.userid; 
    let requests = await usermanager.getRequest(userid); 
    res.send(requests); 
});

app.get("/home/view_goals/:userid", async (req, res) => { 
    var userid = req.params.userid;
    let goals = await goalmanager.viewAll(userid); 
    res.send(goals); 
});


app.post("/home/send_requests", async (req, res ) => {

    var userEmail = req.body.userEmail; 
    var recieverEmail = req.body.email; 

    let registrationToken = await usermanager.sendRequest(userEmail, recieverEmail); 

    res.status(200).send("Notification sent successfully"); 
}); 


app.post("/login", async (req,res) => {
    var token =req.body.idToken; 

    let newUser = await usermanager.login(token); 
    
    res.status(200).send({
        method:"Post",
        idToken:token,
        userid:newUser.id,
        name:newUser.username,
        email:newUser.email
    }); 
}); 

app.post("/home/create_goal/:userid", async (req, res) => {

    var userid = req.params.userid; 
    var title = req.body.title; 
    var author = req.body.author; 
    var content = req.body.content; 
    var milestones = req.body.milestones; 
    var schedule = req.body.schedule; 
    var tag = req.body.tag; 

    await goalmanager.create(userid, title, author, content, milestones, schedule, tag); 

    res.status(200).send("goal created"); 
});

app.put("/home/comment/:userid", async (req, res) => {

    var comment = `${req.body.author} : ${req.body.comment}`;
    var id = req.body.id; 
    var userid = req.params.userid; 
    
    await goalmanager.comment(userid, id, comment); 

    res.send("comment inserted"); 
});

app.put("/home/like/:userid", async (req, res) => { 
    var id = req.body.id; 
    var userid = req.params.userid; 
    
    await goalmanager.like(userid, id); 

    res.send("like recorded");  
});

app.put("/home/confirm_requests/:userid", async (req, res) => {
    var userid = req.params.userid; 
    var senderEmail = req.body.email; 
    await usermanager.confirmRequest(userid, senderEmail); 
    res.send("confirmed request");
});

app.put("/home/firebase/:userid", async (req, res) => {
    var token = req.body.token; 
    var userid = req.params.userid; 
    await usermanager.firebase(userid, token);
    res.send("updated user firebase token");
}); 

app.put("/home/deny_requests/:userid", async (req, res) => {
    var userid = req.params.userid; 
    var senderEmail = req.body.email; 
    await usermanager.denyRequest(userid, senderEmail); 
    res.send("denied request");
});

app.put("/home/update", async (req, res) => {
    var goalid = req.body.id; 
    var index = req.body.index; 
    await goalmanager.update(goalid, index); 
    res.send("updated goal index");
});

module.exports = app; 