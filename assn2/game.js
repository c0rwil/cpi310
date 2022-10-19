/*
Author: Carlos Corral-Williams
Date: 10/3/2022
Description: connect 4 game | assignment2
*/
import {Board} from "./board.js"
import {Player} from "./player.js"
import prompt_sync from "prompt-sync";
const prompt = prompt_sync({sigint:true})

export const start = async (board, player1, player2) => {
    // Init Board and Player
    board = new Board()
    player1 = new Player(1)
    await player1.init()
    player2 = new Player(2)
    await player2.init()
    board.printBoard()
    let gameEnd= false
    let winner;

    // For recording turns
    let turn = 0
    while(!gameEnd) {
        if (board.noMovesLeft())
            break
        const activePlayer = (turn % 2 + 1 === 1) ? player1 : player2
        let currentMove = play(activePlayer)
        board.printBoard()
        gameEnd = board.checkFour(currentMove)
        turn++
        // Check for a winner
        if(gameEnd){
            winner = activePlayer
        }
    }
    // if winner decided
    if(winner!=null){
        console.log('\n',winner.name, ', wins!')
    }
    // else it's a tie
    else{
        console.log("\n Tie!")
    }
    // play calls place from board to add token
    function play(activePlayer){
        board.printBoard()
        let lastMove = moveList(1,7)
        board.place(lastMove,activePlayer.symbol)
        return lastMove
    }
    // valid moves, take input
    function moveList(min,max){
        let input = -1
        let invalid = false
        while(input > max ||input < min) {
            if (invalid) {
                console.log(`\nPlease enter an integer between ${min} and ${max}`)
            }
            console.log("Which column number would you like to place a token?")
            input = Number(prompt())
            invalid= true
        }
        // if capacity is reached in column
        if (board.colCap(input - 1)) {
            console.log("\nColumn has no more space, choose a different spot")
            return moveList(min, max)
        }
        return input - 1
    }
}