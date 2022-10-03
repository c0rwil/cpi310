import inquirer from "inquirer"
import {Board} from "./board.js"

const PLACEMENT_CHOICES = [
    '1','2','3','4','5','6','7']

export class Player {
    constructor(turn){
        this.turn = turn
        this.name = 'Player ${turn}'
    }

    async init(){
        const ans = await inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'what\'s your name?',
            default: 'Player {this.turn}'
        })

        if(ans.name){
            this.name = ans.name
        }
    }

    async move(board) {
        const moves = PLACEMENT_CHOICES.filter((_, index) => !board.table[index])
        const ans = await inquirer.prompt({
            name: 'move',
            type: 'list',
            message: `${this.name} Chose Your Move.`,
            choices: moves
            }
        )

        return PLACEMENT_CHOICES.findIndex(move => move === ans.move)

    }
}
