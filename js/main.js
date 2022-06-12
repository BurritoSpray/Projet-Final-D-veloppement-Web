import {Game} from "./Game.js"
window.onload = main;
window.onkeydown = handleKeys;

let gridHeight = 15;
let gridWidth = 25;
let game;

function main(){
    game = new Game(gridWidth, gridHeight);
}

function handleKeys(event){
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Digit1", "Digit2", "Digit3"].indexOf(event.code) > -1){
        event.preventDefault();
        game.handlePlayerInput(event.code);
    }
}
