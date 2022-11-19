import express from 'express';
import { engine } from 'express-handlebars';
import sqlite3 from 'sqlite3';
import sqlite from 'sqlite';
import bcrypt from "bcrypt";

const cookieParser = require('cookie-parser');
const SALT_ROUNDS = 10;
const dbPromise = sqlite.open({
    filename: './data/todolist.db',
    driver:sqlite3.Database
})
const app = express();
const port = 6969;

async function setup(){
    const db = await dbPromise;
    await db.migrate();
    app.listen(6969,()=>{
        console.log("listening on http://localhost:6969")
    });
}
await setup();

app.use(express.urlencoded())
app.engine('handlebars',engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

// renders home handlebars
app.get("/", async (req, res)=>{
    res.render("home",{layout:false})
})
// renders registration page
app.get("/register",(req,res)=> {
    res.render("home", {layout: false, register: true})
})

app.post('/register', async (req,res)=>{
    const db = await dbPromise;
    const {username, password, passwordx2} = req.body
    if (password !== passwordx2) {
        res.render("register", { error: "Passwords must match" });
        return;
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        username,
        passwordHash
    );
    res.redirect("/");
})

// renders tasks html
app.get("/tasks",(req,res)=>{
    res.render('tasks',{layout:false})
})
