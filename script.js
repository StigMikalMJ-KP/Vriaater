// TODO:
/*
- Lage ferdig spiller-klassen/gjøre om funksjonene inn i klassen


*/


// ====== Variables ======
let guess;
let mousePosX;
let mousePosY;

let deckLength = 52;
let cardChars = ["H", "K", "R", "S"];
let uniDrawnCards = [];
let cardOnTop = randomCard();


// ===== GAME CONFIG ====
const starterCardCount = 5;


// ====== Uni Functions ======
function checkIfCardAllowed(topCardE){
    if(selectedCard.element){
        topCardE.innerHTML = selectedCard.image;
        cardOnTop = selectedCard.element;
        selectedCard.element.remove();
        selectedCard = {};
    }
}

function drawCard(){
    if(uniDrawnCards.length >= deckLength){
        alert("No more cards to draw");
        return null;
    }
    let card;
    do {
        card = randomCard();
    } while(uniDrawnCards.includes(card))
    
    uniDrawnCards.push(card);
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

// ===== Player Class =====
class User {
    constructor(){
        this.turn = 0;
        this.cards = [];
        this.position = document.querySelector("#player-cards");
        this.selectedCard = {element: null, imageSrc: null, cardNum: null};
    }

    addCard(card){
        this.cards.push(card);
    }

    removeCard(card){
        this.cards = this.cards.filter(c => c !== card);
    }
    
    checkIfCardAllowed(topCardE){
        if(this.selectedCard.element){
            topCardE.innerHTML = this.selectedCard.image;
            cardOnTop = this.selectedCard.element;
            this.selectedCard.element.remove();
            this.selectedCard = {};
        }
    }

    gameSetup(topCardE, bunk){
        for(let i = 0; i < starterCardCount; i++){
            let newCard = drawCard();
            this.addCard(newCard);
        }

        this.renderHand()

        topCardE.addEventListener("click", () => {
            this.checkIfCardAllowed(topCardE);
        })

        bunk.addEventListener("click", () => {
            this.addCard(drawCard());
            this.renderHand();
        })
    }

    renderHand(){
        const self = this; //REPLACING "this" WITH "self" IN THIS FUNCTION ONLY
        self.position.innerHTML = "";
       
        self.cards.forEach(c => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "player-hand-cards";
            const img = `<img src="Assets/Kortbilder/${c}.png" alt="">`;

            cardDiv.addEventListener("click", () =>{
                if(self.selectedCard.element && self.selectedCard.element !== cardDiv){
                    self.selectedCard.element.firstChild.id = "";
                }
                if(self.selectedCard.element !== cardDiv){
                    self.selectedCard = {
                        element: cardDiv,
                        image: img,
                        cardNum: c
                    }
                    self.selectedCard.element.querySelector("img").id  = "selectedCard";
                } else{
                    self.selectedCard.element.firstChild.id = "";
                    self.selectedCard.element = null;
                }
            })
                        
            cardDiv.innerHTML = img;
            self.position.appendChild(cardDiv);
        });
    }
}

// ====== Enemy Class ======
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
        if(playable.length > 0){
            let chosen = playable[randInt(0, playable.length)];
            this.removeCard(chosen);
            return chosen;
        }

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

    // PLAYER
    const Player = new User();
    
        // ==== GAME VARIABLES ======
    let enemyPoss = [topEnemy, leftEnemy, rightEnemy];
    let botAmount = document.querySelector("#enemyCount").value;
    let turnList = []
    console.log(botAmount)

    // ====== Initial Setup ======
    topCardE.innerHTML += `<img src="Assets/Kortbilder/${cardOnTop}.png" alt=""></img>`;
    
    Player.gameSetup(topCardE, bunk);

    for(let i = 0; i < botAmount; i++){
        bots.push(new EnemyBot(i+1, enemyPoss[i]));
        for(let j = 0; j < starterCardCount; j++){
            bots[i].addCard(drawCard());
            bots[i].renderHand()
        }
    }
}

document.querySelector("#startBtn").addEventListener("click", main);