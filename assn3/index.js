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
const div = chalk.cyanBright("==================================================");

//database
let db = new sqlite3.Database("./database/todolist.sqlite",(err)=>{
    if (err)
        console.log(err.message);
})

// helper functions
async function login(){
    console.log(div);
    let ask = chalk.cyanBright("Enter your username to log in: ");
    let user_name = prompt(ask);
    let query = `SELECT user_id FROM users WHERE username='${user_name}'`;

    // sqlite await
    let users_id = await query_promise_single(query);
    // if exists
    if(users_id != null){
        let user_id = users_id["user_id"];
        await todo_menu(user_id);
        return user_id;
    }
    // if not exist go main menu
    else{
        console.log(chalk.redBright("User doesn't exist!"));
        await main();
    }
}

// create an account
async function create_account(){
    console.log(div);
    console.log(chalk.cyanBright("Create a new account..."));
    let ask = chalk.cyanBright("Enter a username: ")
    let user_name = prompt(ask);
    let query = `SELECT (user_id) FROM users WHERE users.username='${user_name}'`;

    // sqlite query
    let check = await query_promise_all(query);

    // check if existing
    if(check.length != 0)
    {
        console.log(chalk.red("Username already exists, select a new username."));
        await create_account();
    }
    // if not existing ,create
    else{
        let query_insert = ("INSERT into users(username) values(?)");
        console.log(chalk.cyanBright("Creating account..."));
        await add_query_promise(query_insert,[user_name]);
        console.log(chalk.cyanBright("~~~ Account successfully created! ~~~"));
        console.log(div);
        let users_id = await query_promise_single(query);
        let user_id = users_id["user_id"];
        await todo_menu(user_id);
        return user_id;
    }
}

// menu for todo
async function todo_menu(user_id) {
    // menu
    console.log(div);
    let todo = chalk.yellowBright("TODO ")
    console.log(chalk.cyanBright(`${todo}Menu`));
    console.log(chalk.cyanBright("1. See all tasks"));
    console.log(chalk.cyanBright("2. See incomplete tasks"));
    console.log(chalk.cyanBright("3. See complete tasks"));
    console.log(chalk.cyanBright("4. Add a task"));
    console.log(chalk.cyanBright("5. Toggle a task's completion"));
    console.log(chalk.cyanBright("0. Log out and exit"));

    // input
    let ask = chalk.cyanBright("Enter a menu option: ");
    let menu_choice = prompt(ask);
    console.log(menu_choice)
    // validate input
    if (Number(menu_choice) < 0 || Number(menu_choice > 5)) {
        let query1 = chalk.cyanBright("Choose a valid menu option: ", menu_choice, " not within valid range.");
        menu_choice = prompt(query1);
    }

    // get all tasks for the user
    async function to_do_get_all(user) {
        let res_id;
        let res_description;
        let res_complete;
        console.log(div);
        console.log(chalk.cyanBright("Task list: "));
        let query = `SELECT * FROM tasks WHERE tasks.user_id=${user}`;
        // await all query
        let res = await query_promise_all(query);

        // if not empty
        if(res.length != 0){
            for (let r in res) {
            res_id = res[r]["task_id"];
            res_description = res[r]["task_desc"];
            if (Number(res[r]["is_complete"]) === 1) {
                res_complete = "YES";
            } else {
                res_complete = "NO";
            }
            console.log(chalk.magentaBright(`TASK #${res_id} ${res_description} -- DONE: ${res_complete} `));
            }
        }
        // if empty
        else{
        console.log(chalk.red("!!! NO TASKS IN LIST !!!"));
        console.log(chalk.yellow("Add a task?"));
        }
    }

    // get incomplete tasks
    async function to_do_get_incomplete(user) {
        console.log(div);
        console.log(chalk.yellowBright("INCOMPLETE tasks:"));
        let query = `SELECT * FROM tasks WHERE tasks.user_id=${user} AND tasks.is_complete=false`;
        // await query
        let res = await query_promise_all(query);
        // if not empty
        if(res.length != 0){
            let res_id;
            let res_description;
            let res_complete;
            for (let r in res){
                res_id = res[r]["task_id"];
                res_description = res[r]["task_desc"];
                if (Number(res[r]["is_complete"]) === 1){
                    res_complete = "YES";
                } else{
                    res_complete = "NO";
                }
                console.log(chalk.yellowBright(`TASK #${res_id} ${res_description} -- DONE: ${res_complete} `));
            }
        }
        // if empty
        else{
            console.log(chalk.red("!!! NO TASKS IN LIST !!!"));
            console.log(chalk.yellow("Add a task?"));
        }
    }

    // toggle completion of a task (extra credit OC!!!)
    async function to_do_toggle_complete(user){
        console.log(div);
        let res = await to_do_get_all(user);
        let ask = chalk.greenBright("Enter the ID of the task you wish to mark/unmark: ");
        let task_ID = prompt(ask);
        // query to update
        let query = `UPDATE tasks SET is_complete = ((is_complete | 1) - (is_complete & 1)) WHERE tasks.user_id = ${user} AND tasks.task_id=${task_ID}`
        // awaiting query
        let query2 = await add_query_promise(query);
        console.log(div);
    }

    // get complete tasks
    async function to_do_get_complete(user) {
        console.log(div);
        console.log(chalk.greenBright("COMPLETE tasks:"));
        let query = `SELECT * FROM tasks WHERE tasks.user_id=${user} AND tasks.is_complete=true`;
        // await the query
        let res = await query_promise_all(query);
        //if not empty
        if(res.length!=0){
            let res_id;
            let res_description;
            let res_complete;
            for (let r in res){
                res_id = res[r]["task_id"];
                res_description = res[r]["task_desc"];
                if (Number(res[r]["is_complete"]) === 1){
                    res_complete = "YES";
                }
                else{
                    res_complete = "NO";
                }
                console.log(chalk.greenBright(`TASK #${res_id} ${res_description} -- DONE: ${res_complete} `));
            }
        }
        // if empty
        else{
            console.log(chalk.redBright("There are no complete tasks, maybe complete some?"));
        }
    }


    // add task for user
    async function to_do_add(user) {
        console.log(div);
        console.log(chalk.cyanBright("Adding a new task..."));
        let ask = chalk.cyanBright("Enter the description for the task: ")
        let description = prompt(ask);
        // await insert query
        let query_insert = ("INSERT into tasks(user_id,task_desc,is_complete) values(?,?,?)");
        await add_query_promise(query_insert, [user, description, false]);
        console.log(chalk.cyanBright("Task added..."));
        console.log(div);
    }

    // switch case
    switch (menu_choice) {
        case '0':
            console.log(chalk.red("Logging out and exiting..."));
            return;
        case '1':
            console.log(chalk.cyanBright("Listing ALL tasks..."));
            await to_do_get_all(user_id);
            await todo_menu(user_id);
            break;
        case '2':
            console.log(chalk.cyanBright("Listing INCOMPLETE tasks..."));
            await to_do_get_incomplete(user_id);
            await todo_menu(user_id);
            break;
        case '3':
            console.log(chalk.cyanBright("Listing COMPLETE tasks..."));
            await to_do_get_complete(user_id);
            await todo_menu(user_id);
            break;
        case '4':
            console.log(chalk.cyanBright("Adding task..."));
            await to_do_add(user_id);
            await todo_menu(user_id);
            break;
        case '5':
            console.log(chalk.cyanBright("Toggling task completion..."));
            await to_do_toggle_complete(user_id);
            await todo_menu(user_id);
            break;
    }
}

// sql query for 1 thing
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
// sql query for many
function query_promise_all(query){
    return new Promise( (resolve, reject) => {
        db.all(query,(err,rows) => {
            if(err){
                reject(err.message);
            }
            resolve(rows);
        })
    })
}

// add/update queries
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

// main menu
function start(){
    let todo = chalk.yellowBright("TODO ")
    console.log(chalk.cyanBright("=================================================="));
    console.log(chalk.cyanBright(`Welcome to CPI310 Assignment 3: ${todo} List`));
    console.log(chalk.cyanBright("1. Log in"));
    console.log(chalk.cyanBright("2. Create an account"));
    console.log(chalk.cyanBright("3. Exit"));
}

// main loop
async function main(){
    start();
    let query = chalk.cyanBright("Enter a valid menu option: ");
    let response = prompt(query);
    if(Number(response) > 3 || Number(response < 1))
    {
        let query1 = chalk.cyanBright("Choose a valid menu option: ", response, " not within valid range.");
        response = prompt(query1);
    }

        switch(response) {
            case '1':
                console.log(chalk.cyanBright("login"));
                await login();
                break;
            case '2':
                console.log(chalk.cyanBright("creating new user"));
                await create_account();
                break;
            case '3':
                console.log(chalk.cyanBright("exiting"));
                return;
        }
    }
main();