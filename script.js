'use strict';

/*-----------
*  To-Do:
    -Styling

    -Computer weapon is temporarily set to always paper (line 103)
    -Computer seems to chose paper more than the other weapons.

-----------*/

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
const weapons = ["rock", "paper", "scissors"];
let playerWeapon = "";
let computerWeapon = "";
let playerScore = 0;
let computerScore = 0;
let winningScore = 2;


/*-----------
*  Step 1: Player selects weapon
-----------*/
function selectPlayerWeapon(weapon) {
    if (!weapon.classList.contains('clickable')) {return;}
    
    weapon.classList.add('weapon-choice');
    weapon.classList.remove('clickable');
    document.querySelectorAll('.clickable').forEach(shrinkHide);
    
    playerWeapon = weapon.dataset.weapon;
}

function shrinkHide(obj) {
    obj.addEventListener('transitionend', function() { //The event listener needs to be removed, or it affects later rounds ------------------
        hide(obj);
        obj.classList.remove('shrunk-weapon');},{once:true});
    obj.classList.add('shrunk-weapon');
}

/*-----------
*  Step 2: Play button clicked
-----------*/

function playGame (playerWeaponCard) {
    selectPlayerWeapon(playerWeaponCard);
    computerChooseWeapon();
    let result = returnRoundOutcome(playerWeapon, computerWeapon);
    updateScore(result);
    console.log(result);
    setUserMessage(result)
    if (playerScore === winningScore) {
        endGame("player");
        return;
    }
    
    if (computerScore === winningScore) {
        endGame("computer")
        return;
    } 
  
    unhide(resetButton);

}

function computerChooseWeapon() {
    computerWeapon = weapons[1] //weapons[Math.floor( Math.random() * weapons.length )];
    animateComputerChoice();
    computerWeaponCenter.classList.add('weapon-choice');
    computerWeaponCenter.classList.add(computerWeapon);
    computerWeaponCenter.classList.remove('blank');
    computerWeaponsOuter.forEach(shrinkHide);
    document.querySelector('#computer-space .weapon-choice .weapon-label').textContent = computerWeapon; //Needs to be capitalized to match player weapons
    return computerWeapon;
}

function animateComputerChoice() {
    //for future development
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

// setUserMessage at end of document

/*-----------
*  Reset the game space
-----------*/

function resetRound() {
    const playerWeapons = document.querySelectorAll('#player-space .weapon-container');
    playerWeapons.forEach(resetPlayerWeapon);
    computerWeaponsOuter.forEach(unhide);
    document.querySelector('#computer-space .weapon-choice .weapon-label').textContent = String.fromCharCode(160);
    computerWeaponCenter.classList = "weapon-container blank center";
    playerWeapon = "";
    computerWeapon = "";
    setUserMessage("newRound")
    hide(resetButton);
}

function resetPlayerWeapon(weapon) {
    unhide(weapon);
    weapon.classList.add('clickable');
    weapon.classList.remove('weapon-choice');
}

function hide(obj) {
    obj.classList.add('hidden');
}

function unhide(obj) {
    obj.classList.remove('hidden');
}

function endGame(winner) {
    if (winner === "player") {
        setUserMessage("winGame");
    }

    if (winner === "computer") {
        setUserMessage("loseGame");
    }

    hide(playerSpace);
    hide(computerSpace);
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