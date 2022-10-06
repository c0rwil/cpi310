/*
Author: Carlos Corral-Williams
Date: 10/3/2022
Description: connect 4 game | assignment2
*/
export class Board{
    constructor(){
        this.rows = 6
        this.cols = 7
        this.tableMaker(this.rows,this.cols)
        this.tracker = new Array(this.cols).fill(this.rows-1)
        this.symbols=['-','1','2']
    }
    tableMaker(row,col){
        this.table = new Array(row)
        for (let i = 0; i < row; i++)
        {
            this.table[i]= new Array(col).fill('-')
        }
    }

    async place(player) {
        let colPosition = await player.move(this)
        let rowIndex = this.tracker[colPosition]
        this.tracker[colPosition] = this.tracker[colPosition]-1
        this.table[rowIndex][colPosition] = player.symbol
    }
    colCap(colPosition){
        if(this.tracker[colPosition]<=-1){
            return true
        }
        return false
    }
    printBoard(){
        for(let i = 0; i < this.rows; i++){
            console.log("| " + this.table[i].join(' ')+ " |")
        }
        console.log("-----------------")
        console.log("| 1|2|3|4|5|6|7 |")
        console.log("-----------------")
    }

    checkFour(playerCol) {
        let rowIndex = this.tracker[playerCol]+1
        console.log(rowIndex)
        let symbol = this.table[rowIndex][playerCol]
        return this.checkFlat(symbol,rowIndex,playerCol)||this.checkTall(symbol,rowIndex,playerCol)|| this.checkSlant(symbol,rowIndex,playerCol)
    }
    checkFlat(symbol,row,col)
    {
        let ct = 1
        for (let i = row +1; i<this.rows; i++){
            if(this.table[i][col]!=symbol)
            {break}
            ct++
        }
        for (let i = row-1; i>=0; i--){
            if(this.table[i][col]!=symbol){
                break
            }
            ct++
        }
        if(ct>=4){
            return true
        }
        return false
    }
}