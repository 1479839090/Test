const supertest = require("supertest");
const app = require('./goalstarterMVP');
const request = supertest(app); 






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