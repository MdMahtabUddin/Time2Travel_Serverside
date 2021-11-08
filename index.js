const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0nxkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {

        await client.connect();
        const database = client.db('travel')
        const packagesCollection = database.collection("allPackages");
        const bookingCollection = database.collection("allBooking");
        console.log('Mongodb Connect successfully!');

        // GET API
        app.get('/packages', async (req, res) => {

            const cursor = packagesCollection.find({})
            const packages = await cursor.toArray();
            res.send(packages);

        })

        // GET Single Service
        app.get('/packages/:packageId', async (req, res) => {
            const id = req.params.packageId;
            console.log('getting specific package', id);
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        })

        // GET API - All Bookings
        app.get('/allBooking', async (req, res) => {

            const cursor = bookingCollection.find({})
            const allBooking = await cursor.toArray();
            res.send(allBooking);

        })

        // GET API - My Bookings / Find Specific user booking
        app.get('/myBooking', (req, res) => {
            bookingCollection.find({ email: req.query.email })
                .toArray((err, documents) => {
                    res.send(documents)
                })
        })


        // add package POST / INSERT API
        app.post('/addPackage', async (req, res) => {
            const packageDetails = req.body;
            console.log('hit the post api', packageDetails);

            const result = await packagesCollection.insertOne(packageDetails);
            console.log(result);

            res.json(result);

        })

        // add booking POST / INSERT API
        app.post('/addBooking', async (req, res) => {
            const bookingDetails = req.body;
            console.log('booking data added', bookingDetails);

            const result = await bookingCollection.insertOne(bookingDetails);
            console.log(result);

            res.json(result);

        })


        // DELETE API
        app.delete('/myBooking/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);

            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }
        })


        // UPDATE order status dipu
        // app.patch('/update/:id', (req, res) => {
        //     bookingCollection.updateOne({ _id: ObjectId(req.params.id) },
        //         {
        //             $set: { currentStatus: req.body.currentStatus }
        //         })
        //         .then((result) => {
        //             res.send(result.modifiedCount > 0)
        //         })
        // })

        // UPDATE order status bithy
        app.put('/allBooking/:id', (req, res) => {
            const filter = { _id: ObjectId(req.params.id) }
            bookingCollection.updateOne(filter, {
                $set: {
                    currentStatus: 'Approved'
                }
            })
                .then((result) => {
                    res.send(result)
                })
        })

    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Basecamp server is running!')
})

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})