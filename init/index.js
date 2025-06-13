const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    // await Listing.deleteMany({}); 
    await Listing.insertMany(initData.data);  //since initData is requiring data in the form of an object, we write .data
    console.log("data was initialised");
}

initDB();