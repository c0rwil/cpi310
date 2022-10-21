/*
Author: Carlos Corral-Williams
Date: 10/18/2022
Description: To-Do List | assignment3
*/

//imports
import prompt_sync from 'prompt-sync'
import sqlite3 from "sqlite3";
import chalk from 'chalk';

// constant
const prompt = prompt_sync({sigint:true})

//database
let db = new sqlite3.Database("./database/todolist.sqlite",(err)=>{
    if (err)
        console.log(err.message);
})

// helper functions
async function login(){
    let div = chalk.cyanBright("==================================================");
    console.log(div);
    let ask = chalk.cyanBright("Enter your username to log in: ");
    let user_name = prompt(ask);
    let query = `SELECT user_id FROM users WHERE username='${user_name}'`;
    await query_promise_single(query).then(()=> {
        console.log(chalk.cyanBright("Logged in successfully..."));
        console.log(chalk.cyanBright(`Welcome '${user_name}'`));
    }).catch(()=>{
        console.log(chalk.cyanBright("Account does not exist"));
        console.log(div);
        main();
    });
    let users_id = await query_promise_single(query);
    let user_id = users_id["user_id"];
    console.log(users_id["user_id"]);
    await todo_menu(user_id);
}


async function create_account(){
    let div = chalk.cyanBright("==================================================");
    console.log(div);
    console.log(chalk.cyanBright("Create a new account..."));
    let ask = chalk.cyanBright("Enter a username: ")
    let user_name = prompt(ask);
    let query = `SELECT (user_id) FROM users WHERE username='${user_name}'`;
    await query_promise_single(query).then(()=> {
        console.log(chalk.red("Username already exists, select a new username."));
        create_account();
    }).catch(()=>{
        let query_insert = ("INSERT into users(username) values(?)");
        console.log(chalk.cyanBright("Creating account..."));
        add_query_promise(query_insert,[user_name]);
        console.log(chalk.cyanBright("~~~ Account successfully created! ~~~"));
        console.log(div);
    });
    let users_id = await query_promise_single(query);
    let user_id = users_id["user_id"];
    console.log(users_id["user_id"]);
    await todo_menu(user_id);
}

async function todo_menu(user_id){
    // menu
    let div = chalk.cyanBright("==================================================");
    console.log(div);
    console.log(chalk.cyanBright("TODO Menu"));
    console.log(chalk.cyanBright("1. See all tasks"));
    console.log(chalk.cyanBright("2. See incomplete tasks"));
    console.log(chalk.cyanBright("3. See complete tasks"));
    console.log(chalk.cyanBright("4. Add a task"));
    console.log(chalk.cyanBright("5. Set a task as complete"))
    console.log(chalk.cyanBright("0. Log out and exit"))

    // input
    let ask = chalk.cyanBright("Enter a menu option: ")
    let menu_choice = prompt(ask)

    // validate input
    if(Number(menu_choice) >= 0 || Number(menu_choice <= 5))
    {
        let query1 = chalk.cyanBright("Choose a valid menu option: ", menu_choice, " not within valid range.");
        menu_choice = prompt(query1);
    }

    // switch case
    switch(menu_choice){
        case '0':
            console.log(chalk.red("Logging out and exiting..."));
            return;
        case '1':
            console.log(chalk.cyanBright("Listing ALL tasks..."));
            break
        case '2':
            return
        case '3':
            return
        case '4':
            return
        case '5':
            return
    }
}


function query_promise_single(query){
    return new Promise( (resolve, reject) => {
        db.get(query,  (err,rows) => {
            if(err){
                reject(err.message);
            }
            if(rows == undefined || rows.length==0){
                reject(rows);
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
            if(rows==undefined || rows.length == 0) {
                reject(rows);
            }
        })
    })
}
function insert_query(){
    let insert_Q="";
}

function add_query_promise(query, values){
    return new Promise((resolve, reject)=>{
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
    console.log(chalk.cyanBright("================================================"));
    console.log(chalk.cyanBright("Welcome to CPI310 Assignment 3: TODO List"));
    console.log(chalk.cyanBright("1. Log in"));
    console.log(chalk.cyanBright("2. Create an account"));
    console.log(chalk.cyanBright("3. Exit"));
}


async function main(){
    start();
    let query = chalk.cyanBright("Enter a valid menu option: ");
    let response = prompt(query);
    if(Number(response) > 3 || Number(response < 1))
    {
        let query1 = chalk.cyanBright("Choose a valid menu option: ", response, " not within valid range.");
        response = prompt(query1);
    }

    switch(response){
        case '1':
            console.log(chalk.cyanBright("login"));
            await login()
            break
        case '2':
            console.log(chalk.cyanBright("creating new user"))
            await create_account();
            break
        case '3':
            console.log(chalk.cyanBright("exiting"));
            return
    }
}
main();