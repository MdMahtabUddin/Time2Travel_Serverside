const express =require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()


const app = express();
const port =8000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS} @cluster0.0nxkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req , res)=>{
    res.send('hello world')
})

app.listen(port, ()=>{
    console.log('welcome',port)
})