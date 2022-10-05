/*
Author: Carlos Corral-Williams
Date: 10/3/2022
Description: connect 4 game | assignment2
*/
import inquirer from "inquirer"

const PLACEMENT_CHOICES = [
    '1','2','3','4','5','6','7']

export class Player {
    constructor(turn){
        this.turn = turn
        this.name = 'Player ${turn}'
    }

    async init(){
        const reply = await inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'what\'s your name?',
            default: 'Player {this.turn}'
        })
        if(reply.name){
            this.name = reply.name
        }
    }

    async move(board) {
        const moves = PLACEMENT_CHOICES.filter((_, index) => !board.table[index])
        const reply = await inquirer.prompt({
            name: 'move',
            type: 'list',
            message: `Player${this.turn}, ${this.name}, Choose the row you wish to place a token.`,
            choices: moves
            }
        )
        return PLACEMENT_CHOICES.findIndex(move => move === reply.move)
    }
}
