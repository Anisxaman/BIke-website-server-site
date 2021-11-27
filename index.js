
// -------------------All require---------------------------------------------->

// $ npm install express mongodb cors dotenv
const port = process.env.PORT|| 5000;

var express = require('express')
var cors = require('cors')
var app = express()
require('dotenv').config()
const ObjectId=require("mongodb").ObjectId;

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient } = require('mongodb');

// -------------------mongodb configue--------------------------------->





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.saehn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

// ---------------------mongodb configue end------------------------------>


async function run() {
  try {
    await client.connect();
    console.log("got")
    const database = client.db("Bike_Show");
    const orderCollection = database.collection("Bikes");
    const SingleorderCollection = database.collection("Singleitem");
    const UserInfoCollection = database.collection("UserInfo");
    const reviewInfoCollection = database.collection("reviewInfo");
    // const adminInfoCollection = database.collection("adminInfo");

// ------------------GET Api(limited item)----------------------
    app.get('/item', async(req, res) => {
      // res.send('Hello hhhhhWorld!')
      const cursor =orderCollection.find({}).limit(6);
      const users=await cursor.toArray();
      res.send(users);


    })

//--------------------------------get all item-----------------------------

    app.get('/allitem', async(req, res) => {
      // res.send('Hello hhhhhWorld!')
      const cursor =orderCollection.find({});
      const users=await cursor.toArray();
      res.send(users);


    })


    // ---------------------------GET single service----------------
    app.get('/allitem/:id', async(req, res) => {
     const id=req.params.id;
     console.log("Gettind service",id);

     const query={_id:ObjectId(id)};
    //  const service=await orderCollection.findone(query);
     const service = await orderCollection.findOne(query);
     res.json(service);



    })























// ---------------------------post Api---------------------
  // const result = await orderCollection.insertOne(doc);

  app.post('/manage',async(req, res)=>{
    const service=req.body;
    // service.createAt=new Date();
    const result = await orderCollection.insertOne(service);
    console.log("hit the api",service);
    console.log("hit the api",result);


    res.json(result);
  })
  // ---------------------insert-user ino------------------------->
  app.post('/userinfo',async(req, res)=>{
    const service=req.body;
    service.createAt=new Date();
    const result = await UserInfoCollection.insertOne(service);
    console.log("hit the api",service);
    console.log("hit the api",result);


    res.json(result);
  })

// --------------------------------make admin----------------------------------

app.put("/userinfo/admin",async(req,res)=>{
  const user=req.body;
  console.log("Put",user)
  const filter={email:user.email};
  const updateDoc={$set:{role:"admin"}}
  const result =await UserInfoCollection.updateOne(filter,updateDoc);
  res.json(result);
})


// ------------------------------get admin-------------------------------

app.get('/getadmin/:email', async(req, res) => {
 
  const email=req.params.email;
  console.log(email);
  
  const query={email:email};
  console.log(query);

  const user =await UserInfoCollection.findOne(query);
  console.log(user);

  let isAdmin=false;
  if(user?.role==="admin"){
    isAdmin=true;



  }
  console.log(isAdmin);
  res.json({admin:isAdmin});


})







// ----------------------------------admin section end-------------------












  // ----------------add cart post----------
  app.post('/addorder',async(req, res)=>{
    console.log(req.body);
    const service=req.body;
    const result = await SingleorderCollection.insertOne(service);
    console.log("hit the api",service);
    console.log("hit the api",result);


    res.json(result);
  })


  // ------------------ cart get all order specific user----------------------
  app.get('/singleuser', async(req, res) => {
    // res.send('Hello hhhhhWorld!')
    let query={};
    const email=req.query.email;
    console.log(req.query.email);
    if(email){
      query={email:email};

    }
    const cursor =SingleorderCollection.find(query);
    const users=await cursor.toArray();
    res.send(users);


  })

// ----------------------load cart single order-----------------
  app.get("/singleuser/:id",async(req,res)=>{
   const id=req.params.id;
   console.log("getting specific service",id);
   const query={_id:id};

   const service=await SingleorderCollection.findOne(query);
   res.json(service);
  })


// ---------------------Delete------------------------------

app.delete("/singleuser/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:(id)};
  const result = await SingleorderCollection.deleteOne(query);
  res.json(result)
})





// --------------------------Delete API--------------------------


app.delete("/allitem/:id",async(req,res)=>{
  const id=req.params.id;

  const query={_id:ObjectId(id)};
  const result =await orderCollection.deleteOne(query);
  console.log("deleting user with id",result);
  // res.json(1);
  res.json(result);
})


// ----------------------------------review section---------------------

// ---------------------post review------------------------->
app.post('/post',async(req, res)=>{
  const service=req.body;
  service.createAt=new Date();
  const result = await reviewInfoCollection.insertOne(service);
  console.log("hit the api",service);
  console.log("hit the api",result);


  res.json(result);
})

// ---------------------get review------------------------->

app.get('/review', async(req, res) => {
  // res.send('Hello hhhhhWorld!')
  const cursor =reviewInfoCollection.find({});
  const users=await cursor.toArray();
  res.send(users);


})
// ----------------------------------admin section-------------------

// app.post('/admin',async(req, res)=>{
//   const service=req.body;
//   service.createAt=new Date();
//   const result = await adminInfoCollection.insertOne(service);
//   console.log("hit the api",service);
//   console.log("hit the api",result);


//   res.json(result);
// })















  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   // client.close();
// });



app.use(express.json())
app.get('/', (req, res) => {
    res.send('HelloG World!')
  })
  
  app.listen(port, () => {
    console.log("Server running")
  })