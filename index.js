const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbprl6s.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("productsDB").collection("products");
    const cartCollection = client.db("productCartDB").collection("productCart");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //   update product

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedproduct = req.body;
      const options = { upsert: true };
      const productDoc = {
        $set: {
          name: updatedproduct.name,
          brandName: updatedproduct.brandName,
          type: updatedproduct.type,
          price: updatedproduct.price,
          image: updatedproduct.image,
          rating: updatedproduct.rating,
          description: updatedproduct.description,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        productDoc,
        options
      );
      res.send(result);
    });

    //   cart product API

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const newCartProduct = req.body;
      console.log(newCartProduct);
      const result = await cartCollection.insertOne(newCartProduct);
      res.send(result);
    });

    //   cart delete

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// server checking

app.get("/", (req, res) => {
  res.send("server is run successfully");
});

app.listen(port, (req, res) => {
  console.log(`server port is ${port}`);
});
