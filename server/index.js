require('dotenv').config();
const express = require('express');
const connectToMongo = require('./db/db');
connectToMongo();
const app = express();
const port = 4000;
const cors = require('cors');

//middleware
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/note", require("./routes/note"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));