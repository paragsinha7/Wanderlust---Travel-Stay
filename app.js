const  express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()                              //connect to database
    .then(()=>{
    console.log("connected to DB") 
    })
    .catch(err => {
        console.log(err)
    });  


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//sample listing
// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Waves_On_The_Beach_%28184176683%29.jpeg",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     })

//     await sampleListing.save();
//     console.log("sample was saved");

//     res.send("successful testing");
// });f

app.get("/", (req,res)=>{
    res.send("it is working");
});

//INDEX ROUTE 
app.get("/listings", async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

//new route
app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
});

//CREATE ROute
app.post("/listings", async (req,res)=>{
    // let {title, description, image, price, location, country} = req.body;        //to make it shortcut, we give the names as object[keys] in new/ejs
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//EDIT ROUTE
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
})

//Update route - put
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.listen(8080, ()=>{                  //main server
    console.log("Server is listenting on port 8080");
})