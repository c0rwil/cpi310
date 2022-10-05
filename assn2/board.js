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
            console.log(counter)
            return counter
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
        const two_d_array =[]
        while(this.table.length) two_d_array.push(this.table.splice(0,7))
        console.log(two_d_array)
        function whoWon(two_d_array) {
            let p1 =0
            let p2 = 0
            //check rows
            for(let i = 0; i < 6; i++){
                for(let j = 0; j <7; j++){
                    if (two_d_array[i][j] == 0) {
                        p1 = 0;
                        p2 = 0;
                    } else if (two_d_array[i][j] == 1) {
                        p1++;
                        p2 = 0;
                    } else if (two_d_array[i][j] == 2) {
                        p1 = 0;
                        p2++
                    }
                    if (p1 == 4) {
                        return 1;
                    } else if (p2 == 4) {
                        return 2;
                    }
                }
                p1 = 0;
                p2 = 0;
            }

            // check columns
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 5; j++) {
                    console.log(two_d_array[i][j])
                    if (two_d_array[i][j] == 0) {
                        p1 = 0;
                        p2 = 0;
                    } else if (two_d_array[i][j] == 1) {
                        ++p1;
                        p2 = 0;
                    } else if (two_d_array[i][j] == 2) {
                        p1 = 0;
                        ++p2;
                    }
                    if (p1 == 4) {
                        return 1;
                    } else if (p2 == 4) {
                        return 2;
                    }
                }
                p1 = 0;
                p2 = 0;
            }

            // check diagonal. left to right
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 4; i++) {
                    if (two_d_array[i][j] == two_d_array[i+1][j+1]
                        && two_d_array[i][j] == two_d_array[i+2][j+2]
                        && two_d_array[i][j] == two_d_array[i+3][j+3]) {
                        if (two_d_array[i][j] == 1) {
                            return 1;
                        } else if (two_d_array[i][j] == 2) {
                            return 2;
                        }
                    }
                }
            }

            // loop on diagonals right to left
            for (let j = 0; j < 3; j++) {
                for (let i = 6; i >= 3; i--) {
                    if (two_d_array[i][j] == two_d_array[i-1][j+1]
                        && two_d_array[i][j] == two_d_array[i-2][j+2]
                        && two_d_array[i][j] == two_d_array[i-3][j+3])
                    {
                        if (two_d_array[i][j] == 1) {
                            return 1;
                        } else if (two_d_array[i][j] == 2) {
                            return 2;
                        }
                    }
                }
            }

        }
        return whoWon(two_d_array)
    }
}