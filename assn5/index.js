import express from 'express';
import { engine } from 'express-handlebars';
import {open} from 'sqlite';
import {v4 as uuidv4} from "uuid";
import sqlite3 from 'sqlite3';
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const app = express();
const port = 6969;
const SALT_ROUNDS = 10;


app.engine('handlebars',engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");
app.use(express.urlencoded())
app.use(cookieParser())
const dbPromise = open({
    filename: './data/todolist.sqlite',
    driver:sqlite3.Database
})


// render home
app.get("/", async (req, res)=>{
    let logged_in = checkLoginStatus(req);
    // if not loggedin
    if(!logged_in)
        return res.redirect("/login");

    let tasks = []
    const db = await dbPromise;
    let authenticationSearch = `SELECT * FROM authtokens WHERE token ="${req.cookies.authToken};"`
    let authentications = await db.get(authenticationSearch)
    console.log(authentications)
    let userId = authentications.user_id;

    // row of tasks
    let rows = await db.all(`SELECT * FROM tasks WHERE user_id=${userId};`);

    // push tasks into tasks
    for(let one of rows){
        tasks.push(one);
    }
    let userSearch = `SELECT * FROM users WHERE user_id = ${userId};`
    let result = await db.get(userSearch)
    let username = result.username

    // render home
    return res.render("home",{layout:"main",username:username, tasks:tasks});
})

app.get("/logout", async (req, res) =>{
    res.clearCookie("authToken");
    res.redirect('/')
})

app.get("/login",(req,res)=>{
    return res.render("login",{layout:"main"})
})

// renders registration page
app.get("/register",(req,res)=> {
    return res.render("register", {layout: "main"})
})

app.post("/login",async(req,res)=>{
    if(!req.body.username || !req.body.password)
    {
        return res.render("login", {layout: "main",
            error: "Fill out all fields"});
    }
    let username = req.body.username;
    let password = req.body.password;
    const db = await dbPromise;
    let search = `SELECT * FROM users WHERE username="${username}";`;
    let searched = await db.get(search)

    // if user doesnt exist redirect to login page
    if (!searched) {
        return res.render("login", {layout: "main",
            error: "User nonexistent"});
    }
    // compare the password using bcrypt
    let passwordMatch = await bcrypt.compare(password, searched.password);
    if(!passwordMatch)
    {
        return res.render("login", {layout: "main",
            error: "Wrong password attempted"});
    }

    let userId = searched.user_id;
    let token = uuidv4();

    let insert = "INSERT INTO authtokens(token, user_id) values (?, ?)";
    let tokenVal = [token, userId];
    await db.run(insert, tokenVal);
    // save the token as a cookie
    res.cookie("authToken", token);
    res.redirect('/');
})

app.post('/register', async (req,res)=>{
    if(!req.body.username || !req.body.password || !req.body.passwordx2)
    {
        return res.render("register", {layout: "main",
            error: "Fill out all fields"});
    }

    let password = req.body.password;
    let passwordx2 = req.body.passwordx2;
    let username = req.body.username;

    if(password != passwordx2)
    {
        return res.render("register", {layout: "main",
            error: "The passwords you entered aren't the same"});
    }

    const db = await dbPromise;

    // check is user exists
    let search = `SELECT * FROM users WHERE username="${username}";`;
    let searchResults = await db.get(search)

    // if user already exists, return register with message saying so
    if (searchResults) {
        return res.render("register", {layout: "main",
            error: "attempted username exists already, try another username"});
    }
    // if doesnt return any accounts, create one
    else {
        // passwordHash for user
        let passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        let insert = "INSERT INTO users(username, password) values (?, ?)";
        let insertValueList = [username, passwordHash];
        db.run(insert, insertValueList);

        let search = `SELECT * FROM users WHERE username="${username}";`;
        let searchResults = await db.get(search);
        let userId = searchResults.user_id;
        let token = uuidv4();

        let insertQuery = "INSERT INTO authtokens(token, user_id) values (?, ?)";
        let insert_values = [token, userId];
        await db.run(insertQuery, insert_values);

        res.cookie("authToken", token);
        res.redirect('/');
    }
})

app.post("/add_task",async(req,res)=>{
    let task_desc = req.body.taskDescription;
    const db = await dbPromise;

    // retrieve authtoken from table
    let authSearch = `SELECT * FROM authtokens WHERE token="${req.cookies.authToken}"`;
    let authSearchResult = await db.get(authSearch);
    let userId = authSearchResult.user_id;
    // add new task
    let insert= "INSERT INTO tasks(user_id, task_desc, is_complete) values (?, ?, ?)"
    let insert_values = [userId, task_desc, false];
    await db.run(insert, insert_values);
    res.redirect("/")
})

// check if the user already signed in
function checkLoginStatus(request)
{
    if(request.cookies)
        if (request.cookies.authToken)
            return true;
    return false;
}

async function setup(){
    const db = await dbPromise;
    await db.migrate();
    app.listen(6969,()=>{
        console.log("listening on http://localhost:6969")
    });
}
setup();