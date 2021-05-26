'use strict';

/*-----------
*  Defining elements and event listeners
-----------*/

// Player Space
const playerSpace = document.querySelector('#player-space');
const playersRock = document.querySelector('#player-space .rock');
const playersPaper = document.querySelector('#player-space .paper');
const playersScissors = document.querySelector('#player-space .scissors');

playersRock.addEventListener('click', function() {playGame(playersRock)});
playersPaper.addEventListener('click', function() {playGame(playersPaper)});
playersScissors.addEventListener('click', function() {playGame(playersScissors)});

// Computer Space
const computerSpace = document.querySelector('#computer-space');
const computerWeaponCenter = document.querySelector('#computer-space .weapon-container.center');
const computerWeaponsOuter = document.querySelectorAll('#computer-space .weapon-container.outer');

// Message Board
const userMessage = document.querySelector('#message-board h2')
const resetButton = document.querySelector('#reset-button');

resetButton.addEventListener('click', resetRound);

// Score Board
const playerScoreDisplay = document.querySelector('.player.scorecard .score-display');
const computerScoreDisplay = document.querySelector('.computer.scorecard .score-display');

/*----------
*  Define constants and variables
----------*/
const arrWeapons = ["rock", "paper", "scissors"];
let playerWeapon = "";
let computerWeapon = "";
let playerScore = 0;
let computerScore = 0;
let winningScore = 5;


/*-----------
*  Round Function (triggered by player click on weapon)
-----------*/

function playGame (playerWeaponCard) {
    selectPlayerWeapon(playerWeaponCard);
    computerChooseWeapon();
    let result = returnRoundOutcome(playerWeapon, computerWeapon);
    updateScore(result);
    setUserMessage(result);
    if (playerScore === winningScore) {
        endGame("player");
        return;
    }
    
    if (computerScore === winningScore) {
        endGame("computer");
        return;
    } 
  
    makeUnhidden(resetButton);

}

/*----------
*  Other Functions
----------*/
function capitalize(str) {
    if (!str) {return null;}
    str = str.toLowerCase();
    let head = str[0].toUpperCase();
    let tail = str.substring(1);
    let final = [head, tail];
    return final.join("");
}

function computerChooseWeapon() {
    computerWeapon = arrWeapons[Math.floor( Math.random() * arrWeapons.length )];
    computerWeaponCenter.classList.add('weapon-choice');
    computerWeaponCenter.classList.add(computerWeapon);
    computerWeaponCenter.classList.remove('blank');
    computerWeaponsOuter.forEach(makeHiddenAnimate);
    document.querySelector('#computer-space .weapon-choice .weapon-label').textContent = capitalize(computerWeapon);
    return computerWeapon;
}

function endGame(winner) {
    if (winner === "player") {
        setUserMessage("winGame");
    }

    if (winner === "computer") {
        setUserMessage("loseGame");
    }

    makeHidden(playerSpace);
    makeHidden(computerSpace);
}

function makeHidden(obj) {
    obj.classList.add('hidden');
}

function makeHiddenAnimate(obj) {
    obj.addEventListener('transitionend', function() { //The event listener needs to be removed, or it affects later rounds ------------------
        makeHidden(obj);
        obj.classList.remove('shrunk-weapon');},{once:true});
    obj.classList.add('shrunk-weapon');
}

function makeUnhidden(obj) {
    obj.classList.remove('hidden');
}

function resetPlayerWeapon(weapon) {
    makeUnhidden(weapon);
    weapon.classList.add('clickable');
    weapon.classList.remove('weapon-choice');
}

function resetRound() {
    const playerWeapons = document.querySelectorAll('#player-space .weapon-container');
    playerWeapons.forEach(resetPlayerWeapon);
    computerWeaponsOuter.forEach(makeUnhidden);
    document.querySelector('#computer-space .weapon-choice .weapon-label').textContent = String.fromCharCode(160);
    computerWeaponCenter.classList = "weapon-container blank center";
    playerWeapon = "";
    computerWeapon = "";
    setUserMessage("newRound")
    makeHidden(resetButton);
}

function returnRoundOutcome(playerWeapon, computerWeapon) {
    if (playerWeapon === computerWeapon) {
        return "tie";
    }
    if (
        (playerWeapon === "rock" && computerWeapon === "scissors") ||
        (playerWeapon === "paper" && computerWeapon === "rock") ||
        (playerWeapon === "scissors" && computerWeapon === "paper")) {
        return "win";
    }
    return "loss";

}

function selectPlayerWeapon(weapon) {
    if (!weapon.classList.contains('clickable')) {return;}
    
    weapon.classList.add('weapon-choice');
    weapon.classList.remove('clickable');
    document.querySelectorAll('.clickable').forEach(makeHiddenAnimate);
    
    playerWeapon = weapon.dataset.weapon;
}

function updateScore (result) {
    if (result === "win") {
        playerScore = ++playerScore;
    }
    if (result === "loss") {
        computerScore = ++computerScore;
    }
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
}

function setUserMessage (phase) {
    switch (phase) {
        case "firstRound":
            userMessage.textContent = "Welcome to the game. First to " + winningScore + " points wins. Pick you weapon to start."
            break;
        case "newRound":
            userMessage.textContent = "Pick your weapon to play another round";
            break;
        case "win":
            userMessage.textContent = "You won!";
            resetButton.textContent = "Keep Going!";
            break;
        case "loss":
            userMessage.textContent = "You lost.";
            resetButton.textContent = "Try Again";
            break;
        case "tie":
            userMessage.textContent = "It was a tie";
            resetButton.textContent = "Choose Again";
            break;
        case "winGame":
            userMessage.textContent = "You won! Good work, human."
            break;
        case "loseGame":
            userMessage.textContent = "Well, bummer. The computer beat you this time."
            break;
    }
}

setUserMessage("firstRound");