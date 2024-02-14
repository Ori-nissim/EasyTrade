require("./db.js"); // connect to database
require("dotenv").config();

const express = require('express');
const bodyParser = express.json;
const cors = require('cors');

// create a new server
const app = express();  
app.use(cors());
app.use(bodyParser());

const {PORT} = process.env;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});