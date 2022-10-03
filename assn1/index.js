/*
Author: Carlos Corral-Williams
Date: 9/24/2022
Description: Hangman game | assignment1
*/

// necessary modules or constants
const prompt = require('prompt-sync')({sigint:true});
const {readFileSync, promises: fsPromises} = require('fs');
const readFile = filename => fs.readFileSync(filename).toString('UTF8').split('\n');
const WOF = [0,650,900,700, 500, 800, 500, 650, 500, 900, 0, 1000, 500, 900, 700, 600, 8000, 500, 700, 600,
    550, 500, 900]

// declaration of variables
let currentWord;
let guess;
let hiddenChars = [];
let guessLetter;
let playerList =[];
let dictionary;
let guessLetterList=[];
console.log("Wheel of Fortune Game")

// main loop function for game
async function gameHandler() {
    // get user amount
    let playerCount = Number(prompt("How many players (1-3)?: "));
    if (playerCount > 3 || playerCount < 1) {
        playerCount = Number(prompt("How many players (1-3)?: "));
    }
    // create user obj
    for (let i = 1; i <= playerCount; i++) {
        console.log("Welcome Player" + i + "!")
        let pNumber = i
        let name = prompt("Enter your name: ")
        let roundScore = 0;
        let totalScore = 0;
        playerList.push({pNumber, name, roundScore, totalScore})
    }
    // read files and generate word, 3 rounds
    for(let i = 0; i<3; i++) {
        hiddenChars =[];
        getFileLines('dictionary.txt')
        currentWord = getPuzzleString(dictionary);
    // create hiddencharacter string
    for (letter in currentWord) {
        hiddenChars.push("-").toString();
    }
    hiddenChars = hiddenChars.join("");
    playerList[0].totalScore = doTurn(playerList, currentWord);
    if (guess) {
        if (guess == currentWord) {
            console.log("CONGRATS YOU WON!")
            }
        else {
            console.log("Sorry, incorrect!")
            }
        guess = ""
        playerList[0].roundScore=0;
        }
    }
}

// checks for matches and swaps characters in hiddenarray where matching, returns count
function checkMatches(guessLetter,currentWord){
    for(let i = 0; i < currentWord.length; i++){
        if(currentWord[i].toUpperCase() == guessLetter.toUpperCase()){
            hiddenChars = setCharAt(hiddenChars,i,guessLetter);
        }
    }
    if(currentWord.match(new RegExp(guessLetter, "g")) == null){
        return 0
    }
    else{return currentWord.match(new RegExp(guessLetter, "g")).length}

}
// gets file lines from txt file and reads into array
function getFileLines(filename){
    const CONTENTS = readFileSync(filename,'utf-8');
    dictionary = CONTENTS.split(/\r?\n/);
    return dictionary;
}
// generate puzzle
function getPuzzleString(Dictionary){
    return(dictionary[Math.floor(Math.random() * dictionary.length)]);
}

// spin for points
function spinTheWheel(WOF){
    return Number(WOF[Math.floor(Math.random() * WOF.length)]);
}

//swap characters
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

// main turn functionality (only works for single player)
function doTurn(playerList, currentWord) {
    while(!guess) {
        console.log("\nPlayer" + playerList[0].pNumber + " it's your turn!");
        console.log("Your round score is " + playerList[0].roundScore);
        prompt("Press ENTER to spin the wheel!");
        let points = spinTheWheel(WOF)
        console.log("\nYou spun: " + "[" + points + "]\n")
        // if spin 0 , zero out round points and break loop
        if (points == 0) {
            playerList[0].roundScore = 0;
            return;
        } else {
            // else ask for guess
            console.log("Puzzle: " + hiddenChars + "\n")
            guessLetter = prompt("What letter would you like to guess?: ").toUpperCase()
            // restrict user input!! (Extra credit)
            if(hiddenChars.indexOf(guessLetter) >= 0){console.log("Cannot guess this letter again.")
                guessLetter = prompt("What letter would you like to guess?: ").toUpperCase()
            }
        }
        // count matches
        let guessMatches = checkMatches(guessLetter, currentWord)
        console.log("There are " + guessMatches + " matches")
        if (guessMatches == 0) {
            if ((playerList[0].roundScore - (points / 2)) < 0) {
                playerList[0].roundScore = 0
            } else {
                playerList[0].roundScore = playerList[0].roundScore - (points / 2)
            }
            console.log("Sorry, your guess was incorrect, ending round now.")
            return guess;
        }
        playerList[0].roundScore += points * guessMatches
        console.log(playerList[0].roundScore)
        console.log(hiddenChars)
        let reply = Number(prompt("Enter 1 to Spin & Guess again, or 2 to Solve: ", 1 || 2))
        if (reply > 2 || reply < 1) {
            reply = Number(prompt("Enter 1 to Spin & Guess again, or 2 to Solve: ", 1 || 2))
        }
        if (reply == 2) {
            guess = prompt("Enter the word: ")
            return guess;
        } else {
        }
    }
}
gameHandler()