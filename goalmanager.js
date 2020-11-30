
async function create(userid, title, author, content, milestones, schedule, tag) {
    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017";
    
    const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    if(userid == null || title == null) {
        return 1; 
    }

    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter"); 

    //get current date
    var now = new Date(Date.now()); 
    var dateString = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`; 
    //generate goal id
    var id = `${userid}${title}`;
    var comments = ["Good"];
    var likes = 0;  
    var index = 0; 

    var goal = {
        id, 
        title, 
        author, 
        date : dateString, 
        content, 
        milestones, 
        schedule,
        tag, 
        comments, 
        likes, 
        index 
    }; 
    await db.collection("goals").insertOne(goal); 
    await db.collection("users").updateOne({"id": userid}, {
    $push: {
        "posts": id
    }
    }); 
    client.close();
    return 0; 
}

async function viewAll(userid) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017";
    
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter"); 

    var goals = [];
    
    let user = await db.collection("users").findOne({"id" : userid});  
    let goalids = user.posts; 
    for(var i = 1; i < goalids.length; i++) {
        let goal = await db.collection("goals").findOne({"id" : goalids[i]});
        JSON.stringify(goal); 
        goals.push(goal); 
    }
       
    client.close();

    return goals; 
}

async function viewFeed(userid, limit) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017";
    var feed = []; 
 
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter"); 

    let user = await db.collection("users").findOne({"id" : userid}); 

    //push friends' latest posts to the feed. 
    let friends = user.friendslist; 
    for(var i = 1; i < friends.length && feed.length < limit; i++) {
        let friend = await db.collection("users").findOne({"id" : friends[i]});  
        let postId = friend.posts[friend.posts.length - 1]; 
        let post = await db.collection("goals").findOne({"id" : postId}); 
        feed.push(post); 
    }
    
    //analyze user preferences by tags. 
    var preferences = []; 
    var mode = {}; 
    let posts = user.posts; 
    for(var i = 1; i < posts.length; i++) {
        let post = await db.collection("goals").findOne({"id" : posts[i]}); 
        let tag = post.tag; 
   
        preferences = preferences.concat(tag);
    } 

    let likes = user.likes; 
    for(var i = 1; i < likes.length; i++) {
        let post = await db.collection("goals").findOne({"id" : likes[i]}); 
        let tag = post.tag; 
     
        preferences = preferences.concat(tag);
    }

    let comments = user.comments; 
    for(var i = 1; i < comments.length; i++) {
        let post = await db.collection("goals").findOne({"id" : comments[i]}); 
        let tag = post.tag; 
       
        preferences = preferences.concat(tag);
    }
    
    //compute the most common tag
    if(preferences.length > 0) {
        var maxTag = preferences[0], maxCount = 1;
        for(var i = 0; i < preferences.length; i++)
        {
            var tag = preferences[i];
            if(mode[tag] == null) {
                mode[tag] = 1;
            }
            else {
                mode[tag]++;  
            }

            if(mode[tag] > maxCount) {
                maxTag = tag;
                maxCount = mode[tag];
            }
        }
       
        let recommended = await db.collection("goals").find({"tag" : maxTag}).limit(limit-feed.length).toArray(); 
       
      Array.prototype.push.apply(feed,recommended);
    
    }
    client.close(); 
    return feed; 
}

async function comment(userid, id, comment) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017";
    var now = new Date(Date.now()); 
    var date = `${now.getMonth()} ${now.getDay()}, ${now.getFullYear()}`;

    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter"); 

    let checkuser = await db.collection("users").findOne({"id" : userid}); 
    if(checkuser === null) {
        return 1; 
    }

    await db.collection("goals").updateOne({id}, {$push: {
        "comments": comment
    },
        $set: {
            date
        }
    });

    await db.collection("users").updateOne({"id": userid}, {
        $push: {
            "comments": id
        }
    });

    client.close(); 
    return 0;
}

async function like(userid, id) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017";

    var now = new Date(Date.now()); 
    var date = `${now.getMonth()} ${now.getDay()}, ${now.getFullYear()}`;
    
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter"); 

    let checkuser = await db.collection("users").findOne({"id" : userid}); 
    if(checkuser === null) {
        return 1;  
    }

    await db.collection("goals").updateOne({id}, {$inc: {
        "likes" : 1
    },
        $set: {
            date 
        }
    });
    
    await db.collection("users").updateOne({"id": userid}, {
        $push: {
            "likes": id 
        }
    });

    client.close(); 
    return 0; 
}

async function update(goalid, index) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017";
    const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("GoalStarter");

    if(index > 3 || index < 0) {
        return 1;
    }

    await db.collection("goals").updateOne({"id" : goalid}, {$set: {
        "index": index
    }});


    client.close(); 
    return 0;
}

module.exports = {
    create : create,
    like : like, 
    comment : comment,
    viewAll : viewAll, 
    viewFeed : viewFeed, 
    update : update 
};