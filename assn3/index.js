/*
Author: Carlos Corral-Williams
Date: 10/18/2022
Description: To-Do List | assignment3
*/

//imports
import prompt_sync from 'prompt-sync'
import sqlite3 from "sqlite3";

// constant
const prompt = prompt_sync({sigint:true})

//database
let db = new sqlite3.Database("./database/todolist.sqlite",(err)=>{
    if (err)
        console.log(err.message);
})
// helper functions
function login(){}


function create_account(){
    console.log("Creating a new account");
    let user_name = prompt("Enter a username: ");
    let query_check = "SELECT username FROM users WHERE username=${user_name};";
    let res = query_promise_single(query_check);
    if(res.length>0){
        console.log("Name already exists");
        start();
    }
    else{
        let query = "INSERT into users(username) values(?)";
        let x = add_query_promise(query,user_name);
        let userid = db.run("SELECT user_id FROM users WHERE username=${username};")
        console.log("Creating account...");
        return userid;
    }

}


function todo_menu(){}


function query_promise_single(query){
    return new Promise( (resolve, reject) => {
        db.get(query,  (err,rows) => {
            if(err){
                reject(err.message);
            }
            resolve(rows);
        })
    })
}
function query_promise_all(query){
    return new Promise( (resolve, reject) => {
        db.all(query,  (err,rows) => {
            if(err){
                reject(err.message);
            }
            resolve(rows);
        })
    })
}
function insert_query(){
    let insert_Q="";
}
function add_query_promise(query,values){
    return new Promise((resolve,reject)=>{
        db.run(query,values,(err)=>{
            if(err)
            {
                reject(err.message);
            }
        })
        resolve();
    })
}


function start(){
    console.log("================================================")
    console.log("Welcome to CPI310 Assignment 3: TODO List")
    console.log("1. Log in")
    console.log("2. Create an account")
    console.log("3. Exit")
}


async function main(){
    start();
    let response = prompt("Enter a valid menu option: ");
    if(Number(response) > 3 || Number(response < 1))
    {
        response = prompt("Choose a valid menu option: ",response," not within valid range.");
    }
    switch(response){
        case '1':
            console.log("login");
            login();
            break
        case '2':
            create_account();
            break
        case '3':
            console.log("exiting");
            return
    }
  // let rows = await query_promise_single("SELECT * FROM film;")
  //   for(let row of rows)
  //       console.log(row);
}
main();