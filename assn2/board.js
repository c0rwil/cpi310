/*
Author: Carlos Corral-Williams
Date: 10/3/2022
Description: connect 4 game | assignment2
*/
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
        let position = await player.move(this)
        let counter = 5
        while(this.table[position+(7*counter)]!=0){
            counter--
        }
        if(this.table[position+(7*counter)]==0) {
            this.table[position + (7 * counter)] = player.turn
            return true
        }
        console.log('column already full, choose a different spot')
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