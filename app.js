const  express = require("express");
const app = express();
const mongoose = require("mongoose");


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



app.get("/", (req,res)=>{
    res.send("it is working");
});

app.listen(8080, ()=>{                  //main server
    console.log("Server is listenting on port 8080");
})