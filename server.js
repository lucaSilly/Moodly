//npm ru

//npm run dev

const express = require("express");
const app = express();
require("dotenv").config();

let cors = require("cors");
app.use(cors());

app.use(express.json())

//route pour l'api

const watsonRoutes = require("./routes/api/watson");
app.use("/api/watson",watsonRoutes)


const moodlleRoutes = require("./routes/api/moodle");
app.use("/api/moodle",moodlleRoutes)



//démarer le serveur
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log("server listening on port ", port);
});