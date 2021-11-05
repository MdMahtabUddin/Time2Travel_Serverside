const express =require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;



const app = express();
const port =8000;

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0nxkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
 try{
    await client.connect();
    const database =client.db('time2travel');
    const serviceCollection = database.collection('services')
// console.log('database welcome')
    // post api 
    app.get('/services', async (req, res) => {
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    });

// add service 


 }
 finally{
    // await client.close();
 }
}

run().catch(console.dir);
app.get('/',(req , res)=>{
    res.send('hello world')
})

app.listen(port, ()=>{
    console.log('welcome',port)
})