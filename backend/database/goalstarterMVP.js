const MongoClient = require("mongodb").MongoClient;
var express = require("express"); 

var app = express();
app.use(express.json()); 

const user = {
    "id": 123, 
    "username": "first user", 
    "email": "liurike2000@hotmail.com", 
    "friendlist": [], 
    "posts": [],
    "likes": []
};

const list = [
    {id: "test1",
    title: "I want to pass CPEN 331", 
    author: "Eric", 
    date: "October 22, 2020",
    content: "The class is extremely difficult. I will try my best to pass the course and not fail or get depression", 
    milestones: [],
    schedule: [], 
    tag: "undergraduate",
    comments: ["Good Job", "I hope I pass too"], 
    likes: 12
    }, 
    {id: "test2", 
    title: "I want to get Diamond in League", 
    author: "Jason", 
    date: "October 21, 2020",
    content: "I am a hardstuck Wood V Jax main. I want to climb the ladder with Annie and Zed", 
    milestones: [],
    schedule: [], 
    tag: "LoL",
    comments: ["Good Luck", "You suck"], 
    likes: 0
    }, 
    {id: "test3",
    title: "I want to become the Prime Minister of Canada", 
    author: "Steven", 
    date: "July 1, 2019",
    content: "I believe I should be the Prime Minister of Canada, Trudeau is a terrible and corrupt leader and I will do better", 
    milestones: [],
    schedule: [], 
    tag: "employment",
    comments: ["I voted for you", "What qualifies you for this position?"], 
    likes: 100
    }
];

const months = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];


//connect mongoclient 
MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, function(err, client) {
    if(err) throw err; 
    console.log("GoalStarter Database created\n");
    //create a database
    db = client.db("dbtest"); 

    //create a collectiion for storing goals
    db.createCollection("goals", function(err, res) {
        if(err) throw err; 
        console.log("Goal Collection Created\n"); 
    });
        //create a collection for storing users. 
    db.createCollection("users", function(err, res) {
        if(err) throw err; 
        console.log("User Collection Created\n"); 
    });

    db.collection("users").insertOne(user);

});  

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/home', (req, res) => {
    var userid = req.params.userid; 
    //var list = feed.getFeed(userid);
    res.send(list); 
});

app.post('/home/create_goal/:userid', (req, res) => {
    //generate date string 
    var now = new Date(Date.now()); 
    var date_string = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`; 
    console.log(req); 
    //temporary postid is a concat of userid, date posted, and title of post. 
    var id = `${req.params.userid}${req.body.title}${date_string}`;
    var userid = req.params.userid; 

    //fill in goal fields.
    var title = req.body.title; 
    var author = req.body.author; 
    var content = req.body.content; 
    var milestones = req.body.milestones; 
    var schedule = req.body.schedule; 
    var tag = req.body.tag; 
    var comments = [];
    var likes = 0; 

    var goal = {
        id: id, 
        title: title, 
        author: author, 
        date: date_string, 
        content: content, 
        milestones: milestones, 
        schedule: schedule,
        tag: tag, 
        comments: comments, 
        likes: likes
    }
    db.collection("goals").insertOne(goal); 
    db.collection("users").updateOne({[id]: userid}, {
        $push: {
            posts: id
        }
    });

    res.send("goal inserted"); 
});

const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`Hello, Listening on port ${port}`));

app.put('/home/comment/:userid', (req, res) => {

    var comment = `${req.body.author} : ${req.body.comment}`;
    var id = req.body.id; 
    var userid = req.params.userid; 
    var now = new Date(Date.now()); 
    var date = `${now.getMonth()} ${now.getDay()}, ${now.getFullYear()}`;

    db.collection("goals").updateOne({[id]: id}, {$push: {
        comments: comment
    },
        $set: {
            date: date
        }
    });

    db.collection("users").updateOne({id: userid}, {
        $push: {
            comments: id
        }
    });

    res.send("comment inserted"); 
});

app.put('/home/like/:userid', (req, res) => {
    var id = req.body.id; 
    var userid = req.params.userid; 
    var now = new Date(Date.now()); 
    var date = `${now.getMonth()} ${now.getDay()}, ${now.getFullYear()}`;

    db.collection("goals").updateOne({[id]: id}, {$inc: {
        likes : 1
    },
        $set: {
            date : date 
        }
    });
    
    db.collection("users").updateOne({id: userid}, {
        $push: {
            likes: id 
        }
    });

    res.send("like recorded");  
});