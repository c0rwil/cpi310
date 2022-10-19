/*
Author: Carlos Corral-Williams
Date: 10/3/2022
Description: connect 4 game | assignment2
*/
// board class, has table and tracks various things for the sake of connect 4
export class Board{
    constructor(){
        this.rows = 6
        this.cols = 7
        this.movesLeft = this.rows*this.cols
        this.tableMaker(this.rows,this.cols)
        this.tracker = new Array(this.cols).fill(this.rows-1)
    }
    // generator for table
    tableMaker(row,col){
        this.table = new Array(row)
        for (let i = 0; i < row; i++)
        {
            this.table[i]= new Array(col).fill('-')
        }
    }
    // tracks moves left and places symbol
    place(col, symbol) {
        let rowTrack = this.tracker[col]
        this.tracker[col]=this.tracker[col]-1
        this.table[rowTrack][col] = symbol
        this.movesLeft -= 1
    }
    // when moves have run out return true
    noMovesLeft(){
        return this.movesLeft <= 0;
    }

    // when capacity is reached return true
    colCap(colPosition){
        return this.tracker[colPosition] <= -1;
    }

    // displays the table
    printBoard(){
        for(let i = 0; i < this.rows; i++){
            console.log("| " + this.table[i].join(' ')+ " |")
        }
        console.log("-----------------")
        console.log("| 1|2|3|4|5|6|7 |")
        console.log("-----------------")
    }
    // checks for victory in horizontal, vertical, and diagonal plane
    checkFour(playerCol) {
        let rowIndex = this.tracker[playerCol]+1
        let symbol = this.table[rowIndex][playerCol]
        return this.checkFlat(symbol,rowIndex,playerCol)||this.checkTall(symbol,rowIndex,playerCol)|| this.checkSlant(symbol,rowIndex,playerCol)
    }
    // checks for horizontal win
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
        return ct >= 4;
    }

    // checks for vertical victory
    checkTall(symbol,row,col){
        let ct = 1
        for(let i = col + 1; i < this.cols; i++){
            if(this.table[row][i] != symbol)
                break
            ct++
        }
        for(let i = col - 1; i>=0; i--){
            if(this.table[row][i]!=symbol)
                break
            ct++
        }
        return ct >= 4;
    }

    // checks for diagonal victories
    checkSlant(symbol,row,col) {
        let ct = 1
        //up and left
        for (let i = col - 1, z = row - 1; i >= 0, z >= 0; i--, z--) {
            if (this.table[z][i] != symbol)
                break
            ct++
        }
        // down and right
        for (let i = col + 1, z = row + 1; i < this.cols, z < this.rows; i++, z++) {
            if (this.table[z][i] != symbol)
                break
            ct++
        }
        if (ct >= 4) {
            return true
        }
        ct = 1
        // up and right
        for (let i = col + 1, z = row - 1; i < this.cols, z >= 0; i++, z--) {
            if (this.table[z][i] != symbol)
                break
            ct++
        }
        // down to left
        for (let i = col - 1, z = row + 1; i >= 0, z < this.rows; i--, z++) {
            if (this.table[z][i] != symbol)
                break
            ct++
        }
        return ct >= 4;
    }
}