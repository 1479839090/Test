const supertest = require("supertest");
const app = require('./goalstarterMVP');
const request = supertest(app); 


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



describe('testing feed manager mock', function () {
  it('responds to GET /home/123', async (done) => {
  const response = await request.get('/home/123'); 

  expect(response.status).toBe(200); 
  expect(response.body).toStrictEqual(list); 
  done();
});
}); 



describe('testing fetching user information with correct body',function(){
  it('responds to POST /home/create_goal/123',async(done)=>{
    const body={ 
      title: "Application to Math 302", 
      author: "Steven Huang", 
      content: "Hello World", 
      milestones: ["Milestone1"], 
      schedule: ["Time To Sleep"],
      tag: "tag"
    }
    await request.post('/home/create_goal/123').send(body).expect(200);
    done();    
  })
})

describe('testing fetching user information with body with NUll value ',function(){
  it('responds to POST /home/create_goal/123',async(done)=>{
    const body={
      title: null, 
      author: "Steven Huang", 
      content: "Hello World", 
      milestones: ["Milestone1"], 
      schedule: ["Time To Sleep"],
      tag: "tag"
    }
      await request.post('/home/create_goal/123').send(body).expect(400);
      done();    
  })
})

describe('testing fetching user information with body with wrong userid',function(){
  it('responds to POST /home/create_goal/321',async(done)=>{
    const body={
      title: "abc", 
      author: "Steven Huang", 
      content: "Hello World", 
      milestones: ["Milestone1"], 
      schedule: ["Time To Sleep"],
      tag: "tag"
    }
      await request.post('/home/create_goal/321').send(body).expect(404);
      done();    
  })
})

describe('testing correct login',function(){
  it('responds to POST /login',async(done)=>{
      const body={idtoken:"ADLAHDQLDNKANDKDOHQOEQESVADWQEECC"};
      await request.post('/login').send(body).expect(200);
      done();    
  })
})


describe('testing wrong login',function(){
  it('responds to POST /login',async(done)=>{
      const body={idtoken:"LADJOQJDNLNLANIIWQIDQDWQWQEDLLLLOE"};
      await request.post('/login').send(body).expect(401);
      done();    
  })
})

describe('testing GET userid',function(){
  it('responds to GET /home/view_goals/123',async(done)=>{
      const response=await request.get('/home/view_goals/123');
      expect(response.status).toBe(200); 
      done();    
  })
})


describe('testing GET with wrong userid',function(){
  it('responds to GET /home/view_goals/321',async(done)=>{
      const response=await request.get('/home/view_goals/321');
      expect(response.status).toBe(404); 
      done();    
  })
})

describe('testing PUT on comment with right userid',function(){
  it('responds to PUT /home/comment/123',async(done)=>{
    const body= {id: "test1", author: "Steven Huang", comment: "abcdesef"}
      await request.put('/home/comment/123').send(body).expect(200)  
      done(); 
  })
})


describe('testing PUT ont comment with wrong userid',function(){
  it('responds to PUT /home/comment/321',async(done)=>{
    const body= {id: "test1", author: "Not exist", comment: "ccdddd"}
      await request.put('/home/comment/321').send(body).expect(404);
      done();    
  })
})

describe('testing PUT on like with right userid',function(){
  it('responds to PUT /home/like/userid',async(done)=>{
    const body= {id: "test1"}
      await request.put('/home/like/123').send(body).expect(200);
      done();   
  })
})

describe('testing PUT on like with wrong userid',function(){
  it('responds to PUT /home/like/321',async(done)=>{
    const body= {id: "test1"}
      await request.put('/home/like/321').send(body).expect(404);
      done();   
  })
})