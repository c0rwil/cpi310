import express from 'express';
import { engine } from 'express-handlebars';
import {open} from 'sqlite';
import {v4 as uuidv4} from "uuid";
import sqlite3 from 'sqlite3';
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const SALT_ROUNDS = 10;
const dbPromise = open({
    filename: './data/todolist.db',
    driver:sqlite3.Database
})
const app = express();
const port = 6969;

app.use(cookieParser())

const authenticationMiddleware = async (req, res, next) => {
    if (!req.cookies || !req.cookies.authToken) {
        return next();
    }
    const db = await dbPromise;
    const authToken = await db.get(
        "SELECT * FROM authtokens WHERE token = ?",
        req.cookies.authToken
    );
    if (!authToken) {
        return next();
    }
    const user = await db.get(
        "SELECT user_id, username FROM users WHERE user_id = ?",
        authToken.user_id
    );
    req.user = user;
    next();
};

app.use(authenticationMiddleware)
app.use(express.urlencoded())
// app.use("/static", express.static("./static"));
app.engine('handlebars',engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");



// renders home handlebars
app.get("/", async (req, res)=>{
    const db = await dbPromise;
    const tasks = await db.all(`
    SELECT tasks.task_id, tasks.task_desc, tasks.user_id,
      IIF(tasks.user_id = ?, 1, 0) isByMyself
    FROM tasks
    LEFT JOIN users
    ON users.user_id = tasks.user_id;`,
        req.users ? req.users.user_id : null);
    console.log(tasks);
    res.render("home", { tasks, users: req.users });
})

app.get("/login",(req,res)=>{
    res.render("login",{layout:"main"})
})

// renders registration page
app.get("/register",(req,res)=> {
    if(req.user){
        return res.redirect("/")
    }
    res.render("register", {layout: "main"})
})

app.post("/login",async(req,res)=>{
    const db = await dbPromise;
    const{username,password} = req.body
    if(!username || !password){
        return res.render("login",{error:"all fields must be filled out"})
    }
    try{
        const user = await db.get("SELECT * FROM users WHERE username=?",username);
        if(!user){
            return res.render("login",{ error: "username or password incorrect" })
        }
        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return res.render("login", { error: "username or password incorrect" });
        }

        const token = uuidv4();

        await db.run(
            "INSERT INTO authtokens (token, user_id) VALUES (?, ?);",
            token,
            user.user_id
        );
        res.cookie("authToken", token);
    } catch (e) {
        console.log(e);
        return res.render("login", { error: "something went wrong" });
    }

    res.redirect("/");
})

app.post('/register', async (req,res)=>{
    if (req.user) {
        return res.redirect("/");
    }
    const {username,password, passwordx2}=req.body;
    const db = await dbPromise;


    if (!username || !password || !passwordx2) {
        return res.render("register", { error: "all fields are required" });
    }
    if (password !== passwordx2) {
        return res.render("register", { error: "passwords must match" });
    }

    try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        console.log("passwordHash :", passwordHash);
        await db.run(
            "INSERT INTO users (username, passwordHash) VALUES (?, ?)",
            username,
            passwordHash
        );

        const createdUser = await db.get(
            "SELECT * FROM users WHERE username = ?",
            username
        );

        const token = uuidv4();

        await db.run(
            "INSERT INTO authtokens (token, user_id) VALUES (?, ?);",
            token,
            createdUser.user_id
        );
        res.cookie("authToken", token);
    }
    catch (e) {
        console.log(e);
        if (
            e.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.username"
        ) {
            return res.render("register", { error: "username already taken" });
        }
        return res.render("register", { error: "something went wrong" });
    }

    res.redirect("/");
})

app.post("/add_task",async(req,res)=>{
    if(!req.user){
        return res.redirect("/")
    }
    if(req.body.taskDescription && req.body.length > 500){
        return res.render("home",{error: "messages must be less than 500 characters"})
    }
    const db = await dbPromise
    await db.run("INSERT INTO tasks(task_desc,user_id) VALUES (?,?)",req.body.taskDescription,req.user.user_id)
    res.redirect("/")
})

// app.get('/user/:username', async (req, res) => {
//     const db = await dbPromise;
//     const user = await db.get("SELECT user_id, username FROM users WHERE username=?", req.params.username)
//     if (!user) {
//         return res.send('user not found');
//     }
//     const messages = await db.all("SELECT tasks.task_id, tasks.task_desc, users.username as user FROM tasks LEFT JOIN users ON user.user_id = tasks.user_id WHERE authorId=?;", user.user_id)
//     res.render("profile", { username: req.params.username, messages, user: req.user })
// })

async function setup(){
    const db = await dbPromise;
    await db.migrate({force:false});
    app.listen(6969,()=>{
        console.log("listening on http://localhost:6969")
    });
}
await setup();