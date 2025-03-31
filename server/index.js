const express = require("express");
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require("pg");
const db = new Pool ({
    user: 'sumbhav',
    host: 'localhost',
    database: 'userlogin',
    password: 'password',
    port: 5432,
})


const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log("server started on port 5000");
})

app.get("/", (req, res) => {
    res.send("hello");
})

db.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Database connection error", err);
    } else {
        console.log("Connected to database:", res.rows);
    }
});

app.post("/login", async(req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length == 0) {
            return res.status(400).json({ message: "Email not found"}) //no user found with entered email
        }

        const user = result.rows[0];

        const passwordCheck = await bcrypt.compare(password, user.password); //compare entry with hashed password
        if (!passwordCheck) {
            return res.status(400).json({message : "invalid password"});
        }

        res.json({ message: "Login successfull", user: { id: user.id, name: user.name, email: user.email }});
    } catch (err) {
        console.error(err);
        res.status(500).json({message : "server error"});
    }
})