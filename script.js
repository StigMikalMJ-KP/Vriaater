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
const starterCardCount = 4;


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
class EnemyBot {
    constructor(turnInLine, positionE){
        this.turn = turnInLine;
        this.cards = [];
        this.position = positionE;
    }
    addCard(card){
        this.cards.push(card);
    }

    removeCard(card){
        this.cards = this.cards.filter(c => c !== card);
    }

    chooseCard(topCard){
        let playable = this.cards.filter(c => {
            let suit = c[0];
            let number = c.slice(1);
            let topSuit = topCard[0];
            let topNumber = topCard.slice(1);

            return (suit === topSuit | number === topNumber || number === "8");
        })

        return null; //will have to draw card
    }

    takeTurn(topCard){
        let chosenCard = this.chooseCard(topCard);
        if(chosenCard){
            console.log(`Bot ${this.turn} spiller ${chosenCard}`);
            return chosenCard;
        } else{
            let newCard = drawCard()
            if(newCard){
                this.addCard(newCard);
                console.log(`Bot ${this.turn} trekker et kort`);
            }
            return null;
        }
    }

    renderHand(){
        this.position.innerHTML = "";
        let handClass = "";

        if (this.position.id === "top") handClass = "enemy-hand-horisontal";
        else handClass = "enemy-hand-vertical";

        this.cards.forEach(() => {
            let cardDiv = document.createElement("div");
            cardDiv.innerHTML = `<img src="Assets/Kortbilder/kortbakside.png" alt="">`;
            cardDiv.className = handClass;
            this.position.appendChild(cardDiv);
        });
    }
}

const leftEnemy = document.querySelector("#enemy-left");
const rightEnemy = document.querySelector("#enemy-right");
const topEnemy = document.querySelector("#top");



let bots = [];

function main(){
    document.querySelector("#start-page").style.display = "none";
    document.querySelector("#game-table").style.display = "grid"; 

        // ====== DOM Elements ======
    const topCardE = document.querySelector("#card-throw");
    const handCardsE = document.querySelector("#player-cards");
    const bunk = document.querySelector("#card-bunk");

    


        // ==== GAME VARIABLES ======
    let enemyPoss = [topEnemy, leftEnemy, rightEnemy];
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

    for(let i = 0; i < botAmount; i++){
        bots.push(new EnemyBot(i+1, enemyPoss[i]));
        for(let j = 0; j < starterCardCount; j++){
            bots[i].addCard(drawCard());
            bots[i].renderHand()
         
        }
    }

    for(let i = 0; i < bots.length; i++){
        console.log(bots[i].cards)
        console.log(bots[(i)].position)
    }
    



}
document.querySelector("#startBtn").addEventListener("click", main);