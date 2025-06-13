const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({      //defining the schema
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/coconut-tree-near-body-of-water-HfIex7qwTlI",
        set: (v) => 
            v === "" ? "https://unsplash.com/photos/coconut-tree-near-body-of-water-HfIex7qwTlI" 
            : v,
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);   //making the model
module.exports = Listing;