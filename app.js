const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()                              //connect to database
    .then(() => {
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

app.get("/", (req, res) => {
    res.send("it is working");
});

//Joi middleware
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el=>el.message)).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

//INDEX ROUTE 
app.get("/listings",  wrapAsync(async (req, res,next) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id",  wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
}));

//CREATE ROute
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, location, country} = req.body;        //to make it shortcut, we give the names as object[keys] in new/ejs
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data");
    // };

    // let result = listingSchema.validate(req.body);           joi
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//EDIT ROUTE
app.get("/listings/:id/edit",  wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));

//Update route - put
app.put("/listings/:id", validateListing,  wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",  wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//This is the route which gives an error when we are trying
// to enter a page that hasn't been created

// app.all("*", (req,res,next)=>{
//     next(new ExpressError(404, "Page not found!"));
// });

//error handler middleware;
app.use((err, req, res, next) => {
    const { statusCode = 404, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.render("./error.ejs" , {err});
});

app.listen(8080, () => {                  //main server
    console.log("Server is listenting on port 8080");
}) 