const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const server = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { createProduct } = require('./controller/ProductController');
const productsRouter=require('./routes/ProductRoute');
const brandsRouter=require('./routes/BrandRoute');
const categoryRoute=require('./routes/CategoryRoute');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

dotenv.config();
const client = new MongoClient(process.env.MDB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
async function run() {
  try {
    // await client.connect();
    // await client.db("ecomm").command({ ping: 1 });
    mongoose.connect(process.env.MDB1_URL)
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch((err)=> console.log(err));


server.use(express.json());
server.use('/products',productsRouter.router);
server.use('/category',categoryRoute.router);
server.use('/brand',brandsRouter.router);


server.listen(8000,()=> console.log('server started'))

server.get('/',(req,res)=> res.send('connected')) 
