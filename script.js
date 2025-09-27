// TODO:
/*

- Bots
- Kortsystem

*/


// ====== Variables ======
let guess;
let mousePosX;
let mousePosY;

let deckLength = 52;
let cardChars = ["H", "K", "R", "S"];
let selectedCard = {element: null, image: null, cardNum: null};
let drawnCards = [];
let cardOnTop = randomCard();


// ===== GAME CONFIG ====
const starterCardCount = 5;


// ====== Functions ======
function giveDrawnCard(card, object){
    let newCard = document.createElement("div");

    newCard.innerHTML = `<img src="Assets/Kortbilder/${card}.png" alt="">`;
    newCard.className = "player-hand-cards";
    newCard.addEventListener("click", function(){
        if(selectedCard.element && selectedCard.element !== newCard){
            selectedCard.element.firstChild.id = "";
        }
        if(selectedCard.element !== newCard){
            selectedCard = {
                element: newCard,   
                image: `<img src="Assets/Kortbilder/${card}.png" alt="">`,
                cardNum: card
            }
            selectedCard.element.querySelector("img").id = "selectedCard";
        } else{
            selectedCard.element.firstChild.id = "";
            selectedCard.element = null;
        }  
    });
    object.appendChild(newCard);
}

function checkIfCardAllowed(topCardE){
    if(selectedCard.element){
        topCardE.innerHTML = selectedCard.image;
        cardOnTop = selectedCard.element;
        selectedCard.element.remove();
        selectedCard = {};
    }
}

function drawCard(){
    if(drawnCards.length >= deckLength){
        alert("No more cards to draw");
        return null;
    }

    let card;
    do {
        
        card = randomCard();
    } while(drawnCards.includes(card))
    
    drawnCards.push(card);
    return card;
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
class player {
    constructor(turnInLine, cards){
        this.turn = turnInLine;
        this.cards = cards;
    }
}

class EnemyBot {
    constructor(turnInLine, cards){
        this.turn = turnInLine;
        this.cards = cards;
    }
}


function main(){
    document.querySelector("#start-page").style.display = "none";
    document.querySelector("#game-table").style.display = "grid"; 

        // ====== DOM Elements ======
    let topCardE = document.querySelector("#card-throw");
    let handCardsE = document.querySelector("#player-cards");
    let bunk = document.querySelector("#card-bunk");

        // ==== GAME VARIABLES ======
    let botAmount = document.querySelector("#enemyCount").value;
    console.log(botAmount)

    // ====== Event Listeners ======
    topCardE.addEventListener("click", function(){
        checkIfCardAllowed(topCardE)
    });
    bunk.addEventListener("click", function(){
        let newCard = drawCard();
        giveDrawnCard(newCard, handCardsE)
    })

    // ====== Initial Setup ======
    topCardE.innerHTML += `<img src="Assets/Kortbilder/${cardOnTop}.png" alt=""></img>`;

    for(let i = 0; i < starterCardCount; i++){
        let newCard = drawCard();
        giveDrawnCard(newCard, handCardsE)
    }

}
document.querySelector("#startBtn").addEventListener("click", main);