const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log("server started on port 5000");
})

app.get("/", (req, res) => {
    res.send("hello");
})