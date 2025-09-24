// TODO:
/*

- Bots
- Kortsystem

*/


// ====== Variables ======
let guess;
let mousePosX;
let mousePosY;

let cardChars = ["H", "K", "R", "S"];
let selectedCard = {};
let usedCards = [];
let cardOnTop = randomCard();

// ====== DOM Elements ======
let topCardE = document.querySelector("#top-card");
let handCardsE = document.querySelector("#player-cards");
let backSideCard = document.querySelector("#backside-card");

// ====== Initial Setup ======
topCardE.innerHTML = `<img src="Assets/Kortbilder/${cardOnTop}.png" alt=""></img>`;
makePlayerCards();

// ====== Event Listeners ======
topCardE.addEventListener("click", function(){
    if(selectedCard.element){
        topCardE.innerHTML = selectedCard.image;
        cardOnTop = selectedCard.element;
        selectedCard.element.remove();
        selectedCard = {}
    }
});

// ====== Functions ======
function makePlayerCards(){    
    for(let i = 0; i < 5; i++){
        let randCard = randomCard();
        let newCard = document.createElement("div");

        newCard.innerHTML = `<img src="Assets/Kortbilder/${randCard}.png" alt=""></img>`;
        newCard.className = "card hand-card";

    
        newCard.addEventListener("click", function(){
            if(selectedCard.element && selectedCard.element !== newCard){
                selectedCard.element.firstChild.id = "";
            }
            if(selectedCard.element !== newCard){
                selectedCard = {
                    element: newCard,
                    image: `<img src="Assets/Kortbilder/${randCard}.png" alt=""></img>`,
                    cardNum: randCard
                }
                selectedCard.element.firstChild.id = "selectedCard";
            } else{
                selectedCard.element.firstChild.id = "";
                selectedCard.element = null;
            }  
        });

        handCardsE.appendChild(newCard);    
    }
}

function randomCard(){
    let idx = randInt(0,3);
    let num = randInt(1,13);
    let char = cardChars[idx];
    return char + num;
}

function randInt(fom,tom){
    return Math.floor(Math.random()*(tom-fom+1)+fom);
}

// ====== Classes ======
class EnemyBot {
    constructor(turnInLine, cards){
        this.turn = turnInLine;
        this.cards = cards;
    }
}


function main(){


}
document.addEventListener("DOMContentLoaded", main());