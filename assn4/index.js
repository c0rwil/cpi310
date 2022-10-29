/*
Author: Carlos Corral-Williams
Date: 10/18/2022
Description: To-Do List | assignment3
*/

//imports
import prompt_sync from 'prompt-sync'
import cookieparser from "cookie-parser";
import expresshandlebars from "express-handlebars"
// import sqlite from "sqlite";
import sqlite3 from 'sqlite3';
// import sqlite from "sqlite";
import express from "express"
import chalk from 'chalk';

//constants
// const sqlite3 = require('sqlite3')
// const sqlite = require('sqlite')
const app = express();
const cookieParser = cookieparser();

const port = 8083;

app.engine("handlebars",expresshandlebars.engine())
app.set("view engine", "handlebars");
app.set("views", "./views")

app.use(express.static("static"));
app.use(express.urlencoded( { extended: false }));
app.use(cookieParser);

const dbPromise = sqlite3.verbose({
    filename: './sakila.sqlite',
    driver: sqlite3.Database
});

app.get("/", (req,res) => {
    res.render("home",{layout:false})
})

app.listen(port,() => {
    console.log("Server started on port: ${port}");
})
const db = await dbPromise
app.post("/get_actor", async(req,res) => {
    let last_name = req.body.actor
    let query = `SELECT * FROM actor WHERE last_name="${last_name}";`
    let result = await db.get(query)

    if(result){
        res.cookie("actor_id", result.actor_id)
    }
    else{
        res.redirect("/")
    }
})

app.get("/get_films", async(req,res) => {
    let actor_id = req.cookies.actor_id
    let film_id_query = `SELECT * FROM film_actor WHERE actor_id=?;`
    let film_id_list = await db.all(film_id_query, actor_id)
    let film_list =[]
    for(item of film_id_list){
        let film_info_query = `SELECT * from film WHERE film_id =?;`
        let result = await db.get(film_info_query,item.film_id)
        if(result){
            film_list.push(result)
        }
    }
    let actor_query = `SELECT * FROM actor WHERE actor_id = ?;`
    let actor = await db.get(actor_query,actor_id);
    res.render("films",{
        layout:false,
        "first_name":actor.first_name,
        "last_name":actor.last_name,
        "films":film_list
    })
})