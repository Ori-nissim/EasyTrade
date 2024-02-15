require("./db.js"); // connect to database
require("dotenv").config();

const express = require('express');
const bodyParser = express.json;
const cors = require('cors');
const routes = require('./routes');
// create a new server
const app = express();  
app.use(cors());
app.use(bodyParser());
app.use("/api",routes);
const {PORT} = process.env;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});