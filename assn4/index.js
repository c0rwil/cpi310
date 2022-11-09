/*
Author: Carlos Corral-Williams
Date: 10/18/2022
Description: To-Do List | assignment3
*/

//constants
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const port = 8083;

app.engine("handlebars",engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("static"));
app.use(express.urlencoded({ "extended": false }));
app.use(cookieParser());


app.listen(port,() => {
    console.log(`Server started on port: ${port}`);
})

const dbPromise = sqlite.open({
    filename: './todolist.sqlite',
    driver: sqlite3.Database
});


app.get("/", (req,res) => {
    res.render("home",{layout:false})
})

app.get("/register",(req,res)=>{
    res.render("home",{layout:false,register:true})
})
app.get("/tasks",(req,res)=>{
    res.render('tasks',{layout:false})
})

app.get("/get_tasks", async(req,res) => {
    const db = await dbPromise
    console.log(req.cookies.username)
    let user_id_query = `SELECT user_id FROM users WHERE username="${req.cookies.username}";`
    let user_id= await db.get(user_id_query)
    console.log(user_id)
    let user_ID= user_id.user_id
    let task_query = `SELECT * FROM tasks WHERE user_id = ${user_ID}`
    let tasks = await db.all(task_query)
    let todo_list = []
    for(let task of tasks){
        todo_list.push(task)
    }
    res.render("tasks",{
        layout:false,
        username:req.cookies.username,
        tasks:todo_list
    })
})
app.post("/get_users", async(req,res) => {
    let username = req.body.username
    console.log(username)
    const db = await dbPromise;
    let query = `SELECT * FROM users WHERE username="${username}";`
    let result = await db.get(query)
    if(result){
        console.log(result)
        res.cookie("username", username)
        res.redirect("/get_tasks")
    }
    else{
        console.log("went here why")
        res.render("register", {layout:false, error:true})
    }
})
app.post("/create_account",async(req,res)=>{
    let username = req.body.username
    const db = await dbPromise
    let query = `SELECT * FROM users WHERE username="${username}";`;
    let result = await db.get(query)
    if(result){
        res.render("home",{layout:false, register:true,error:true})
    }
    else{
        let insQuery = "INSERT INTO users(username) values(?)"
        let value = [username]
        await db.run(insQuery, value)
        res.cookie("username",username)
        res.redirect('/get_tasks')
    }
})
app.post("/add_task",async (req,res) => {
    let task_info = req.body.taskDescription;
    const db = await dbPromise;
    console.log(req.cookies.username)
    let queryUsers= `SELECT user_id from users WHERE username = "${req.cookies.username}"`
    let ID = await db.get(queryUsers);
    console.log(ID)
    let userID = ID.user_id
    let insert = 'INSERT INTO tasks(user_id, task_desc, is_complete) values (?,?,?)'
    let value = [userID,task_info,false]
    await db.run(insert,value)
    res.redirect("/get_tasks")
})

