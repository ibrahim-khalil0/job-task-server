const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware is here
app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqms9ir.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




const totalTask = client.db('taskDB').collection('totalTask')



app.post('/task', async(req, res) => {
 
     const newTask = req.body
     const result = await totalTask.insertOne(newTask)
     res.send(result)
 })



 app.get('/task/:email', async(req, res) => {
    const email = req.params.email
    const query = {userEmail : email, status: 'new'}
    const data = await totalTask.find(query).toArray()
    res.send(data)
  })

 app.get('/ongoing/:email', async(req, res) => {
    const email = req.params.email
    const query = {userEmail : email, status: 'ongoing'}
    const data = await totalTask.find(query).toArray()
    res.send(data)
  })

 app.get('/completed/:email', async(req, res) => {
    const email = req.params.email
    const query = {userEmail : email, status: 'completed'}
    const data = await totalTask.find(query).toArray()
    res.send(data)
  })



  app.put('/ongoing/:id', async(req, res) => {
    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const options = {upsert: true}
    const updateOngoing = {
      $set: {
        status: "ongoing"
      }
    }
    const result = await totalTask.updateOne(query, updateOngoing, options)
    res.send(result)
  })


  app.put('/completed/:id', async(req, res) => {
    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const options = {upsert: true}
    const updateOngoing = {
      $set: {
        status: "completed"
      }
    }
    const result = await totalTask.updateOne(query, updateOngoing, options)
    res.send(result)
  })




  app.delete('/delete/:id', async(req, res) => {
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
  
    const result = await totalTask.deleteOne(query)
    res.send(result)
  })



app.get('/', (req, res) => {
    res.send('Job task server is running')
})

app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})