/*
Author: Carlos Corral-Williams
Date: 10/18/2022
Description: To-Do List | assignment3
*/

const sqlite = require("sqlite3");
let db = new sqlite3.Database("./database/sakila.sqlite",(err)=>{
    if(err)
        console.log(err.message)
})

async function main(){
  let rows = await query_promise("SELECT * FROM film;")
    for(let row of rows)
        console.log(row)
}

function query_promise(query){
    return new Promise( (resolve, reject) => {
        db.all(query,  (err,rows) => {
            if(err){
                reject(err.message)
            }
            resolve(rows)
        })
    })
}