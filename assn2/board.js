// TODO construct connect 4 board
import { Player } from "./player.js"
export class Board{
    constructor(){
        this.table = [
            0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,
            0,0,0,0,0,0,0
            ]
        this.symbols=['-','1','2']
    }

    async place(player) {
        const position = await player.move(this)
        if (this.table[position] == 0) {
            this.table[position] = player.turn
            return true
        }
        console.log('column already full, choose a different spot')
        return false
    }
    printBoard(){
        const arr = []
        for (let i = 0; i < 6; i++) {
            let row = []
            for (let j = 0; j < 7; j++) {
                row.push(this.symbols[this.table[i * 7 + j]])
            }
            arr.push('| '+row.join(' | ')+' |')
        }
        console.log("-----------------------------")
        console.log(arr.join('\n') + '\n' +"-----------------------------")
        console.log("| 1 | 2 | 3 | 4 | 5 | 6 | 7 |")
    }

    checkWin(player) {
        const checkList = [
            [0, 1, 2, 3],
            [3, 4, 5, 6],
            [6, 7, 8, 9],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < checkList.length; i++) {
            const check = checkList[i]
            let count = 0
            for (let i = 0; i < check.length; i++) {
                if (this.table[check[i]] === player.turn) {
                    count = count + 1
                }
                if (count === 4) {
                    return true
                }
            }
        }
        return false
    }
}