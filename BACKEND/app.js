const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const connectToMongoDB = require("./connect");
const URL = require("./routes/url");

app.use(cors());
app.use(express.json());

app.use("/url", URL)

connectToMongoDB().then(() => {
    app.listen(3000, () => {
        console.log("Server Started");
    });
});