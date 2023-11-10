const express = require('express')
const app = express();
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://happyUser:y7YCwQUfwddbTUi2@cluster0.px2gaoj.mongodb.net/?retryWrites=true&w=majority`;

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

        const destinationsCollection= client.db("happy-travel").collection("destinations")
        const reviewsCollection= client.db("happy-travel").collection("reviews")
        const bookingCollections= client.db("happy-travel").collection("bookings")

        app.get('/destinations',async (req,res)=>
        {
            const result= await destinationsCollection.find().toArray();
            res.send(result)
        })


        app.get('/reviews',async (req,res)=>
        {
            const result= await reviewsCollection.find().toArray();
            res.send(result)
        })


        // bookingCollections

        app.get('/bookings',async(req,res)=>
        {
            const email=req.query.email
            
            if(!email)
            {
                res.send([]);
            }
            const query={email:email}
            const result= await bookingCollections.find(query).toArray();
            res.send(result)
        })

        app.post('/bookings',async(req,res)=>
        {
            const bookingInfo=req.body;
            const result = await bookingCollections.insertOne(bookingInfo)
            res.send(result);
        })

        app.delete('/bookings/:id',async(req,res)=>
        {
          const id=req.params.id
          const query={_id: new ObjectId(id)}
          const result= await bookingCollections.deleteOne(query);
          res.send(result)
        })

    } finally {



    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Port Running')
})

app.listen(port, () => {
    console.log(`Port running on ${port}`)
})