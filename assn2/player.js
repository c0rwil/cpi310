/*
Author: Carlos Corral-Williams
Date: 10/3/2022
Description: connect 4 game | assignment2
*/
import prompt_sync from "prompt-sync"
const prompt = prompt_sync({sigint:true})

// player class for each player in game
export class Player {
    constructor(turn){
        this.turn = turn
        this.name = 'Player ${turn}'
        if(turn==1){this.symbol="1"}
        else{this.symbol="2"}
    }

    // takes player name and assigns to self
    async init(){
        const reply = prompt("Enter a username: ")
        if(reply){
            this.name = reply
        }
    }

}
