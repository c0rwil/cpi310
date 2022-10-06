/*
Author: Carlos Corral-Williams
Date: 10/3/2022
Description: connect 4 game | assignment2
*/
import {Board} from "./board.js"
import {Player} from "./player.js"

export const start = async (board, player1, player2) => {
    // Init Board and Player
    board = new Board()
    player1 = new Player(1)
    await player1.init()
    player2 = new Player(2)
    await player2.init()
    board.printBoard()
    // For recording turns
    let turn = 0
    for (let i = 0; i < 42; i++) {
        const activePlayer = (turn % 2 + 1 === 1) ? player1 : player2
        let currentMove = await board.place(activePlayer)
        board.printBoard()
        // Check for a winner
        if(board.checkFour(currentMove))
        {
            console.log("Congrats Player ${activePlayer}, you win!")
            break;
        }
        turn++
    }
    console.log('Draw!')
}