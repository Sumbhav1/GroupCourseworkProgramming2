const express = require("express");
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/authenticateToken');

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
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, settings_finished: user.settings_finished }, 'your_jwt_secret_key', { expiresIn: '1h' });

        res.json({
            message: "Login successful",
            token,  // send token for session verification
            user: { id: user.id, name: user.name, email: user.email, settings_finished: user.settings_finished}
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

        const newUser = await db.query("INSERT INTO users (name, email, password, settings_finished) VALUES ($1, $2, $3, $4) RETURNING id, name, email, settings_finished",
        [name, email, hashedPassword, false]);

        const user = newUser.rows[0];
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, settings_finished: user.settings_finished}, 'your_jwt_secret_key', { expiresIn: '1h' });

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

app.post("/settings", authenticateToken, async(req, res) => {
    const { calories, bedtime, wakeupTime, hoursSleep, mealsDay, notificationsSleep, notififcationsMeals} = req.body;
    const userId = req.user.id;
    try {
        const existing = await db.query("SELECT * FROM user_settings WHERE user_id = $1", [userId]);

        if (existing.rows.length > 0){
            await db.query(
                `UPDATE user_settings 
                 SET calories_per_day = $1, bedtime = $2, wakeup_time = $3, sleep_hours = $4, meals_per_day = $5, notifications_sleep = $6, notifications_meals = $7, updated_at = NOW()
                 WHERE user_id = $8`,
                 [calories, bedtime, wakeupTime, hoursSleep, mealsDay, notificationsSleep, notificationsMeals, userId]
            );
        } else {
            await db.query(
                `INSERT INTO user_settings 
                 (user_id, calories_per_day, bedtime, wakeup_time, sleep_hours, meals_per_day, notifications_sleep, notifications_meals)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                 [userId, calories, bedtime, wakeupTime, hoursSleep, mealsDay, notificationsSleep, notificationsMeals]
            );
        }        
        res.status(200).json({ message: "settings saved successfully"});
    } catch (err) {
        console.error("Error occurred: ", err);
        res.status(500).json({ message: "Internal Server Error"});
    }

});

app.get("/settings", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db.query("SELECT * FROM user_settings WHERE user_id = $1", [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Settings not found" });
        }

        const settings = result.rows[0];

        res.status(200).json({
            calories: settings.calories_per_day,
            bedtime: settings.bedtime,
            wakeupTime: settings.wakeup_time,
            hoursSleep: settings.sleep_hours,
            mealsDay: settings.meals_per_day,
            notificationsSleep: settings.notifications_sleep,
            notificationsMeals: settings.notifications_meals,
        });

    } catch (err) {
        console.error("Error fetching settings:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
