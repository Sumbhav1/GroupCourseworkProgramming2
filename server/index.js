const express = require("express");
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');

const db = new Pool ({
    user: 'sumbhav',
    host: 'localhost',
    database: 'userlogin',
    password: 'password',
    port: 5432,
}) // db connection

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
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });

        res.json({
            message: "Login successful",
            token,  // send token for session verification
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message : "server error"});
    }
})


app.post("/sign-up", async(req, res) => {
    const { name, email,  password} = req.body;
    try {
        const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if (userCheck.rows.length > 0){
            return res.status(400).json({ message: "Email already in use" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
        [name, email, hashedPassword]);

        const user = newUser.rows[0];
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });

        res.status(201).json({
            message: "Sign-up successful",
            token,
            user
        });

    }catch(err){
        console.error("Sign up error", err);
        res.status(500).json({message: "Server error"});

    }

})