// TODO:
/*
- Fikse bot
- Lage render topcard funksjon.
*/


// ====== Variables ======
let guess;
let mousePosX;
let mousePosY;

let deckLength = 52;
let cardChars = ["H", "K", "R", "S"];
let uniDrawnCards = [];
let cardOnTop = randomCard();
let playerHasPlayed = false;


// ===== GAME CONFIG ====
const starterCardCount = 5


// ====== Uni Functions ======
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
    const idx = randInt(0,3);
    const num = randInt(1,13);
    let char = cardChars[idx];
    return char + num;
}

function randInt(fom,tom){
    return Math.floor(Math.random()*(tom-fom+1)+fom);
}

function renderTopCard(cardOnTop){
    return 0; // BLI FERDIG MED DEN
}



// ===== Player Class =====
class User {
    constructor(){
        this.turn = 0;
        this.cards = [];
        this.position = document.querySelector("#player-cards");
        this.selectedCard = {element: null, imageSrc: null, cardNum: null};
        this.canPlay = true;
    }

    addCard(card){
        this.cards.push(card);
    }

    removeCard(card){
        this.cards = this.cards.filter(c => c !== card);
    }
    
    useCard(topCardE){
        const chosenCard = this.selectedCard.cardNum
        let suit = chosenCard[0];
        let number = chosenCard.slice(1);
        let topSuit = cardOnTop[0];
        let topNumber = cardOnTop.slice(1);

        const cardWorks = (suit === topSuit | number === topNumber || number === "8")

        if(!this.canPlay){
            return null;
        }

        if(this.selectedCard.element && cardWorks){
            topCardE.innerHTML = this.selectedCard.image;
            cardOnTop = this.selectedCard.cardNum;
            this.removeCard(this.selectedCard.cardNum)
            this.selectedCard.element.remove();
            this.selectedCard = {};
            return chosenCard;
        } else if(!cardWorks){
            return false
        }
    }

    gameSetup(topCardE, bunk){
        for(let i = 0; i < starterCardCount; i++){
            const newCard = drawCard();
            this.addCard(newCard);
        }

        this.renderHand()

        topCardE.addEventListener("click", () => {
            const usingCard = this.useCard(topCardE);
            if(usingCard === null){
                console.log("It is not the Player's turn!")
            } else if(usingCard === false){
                console.log("The selected card is not useable.")
                alert("The selected card is not useable!")
            }else{
                console.log(`Player has used  ${usingCard}`)
                User.onMoveEnd()
            }
        })

        bunk.addEventListener("click", () => {
            this.addCard(drawCard());
            console.log(this.cards)
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

function waitForPlayerTurn(){
    return new Promise(resolve => {
        User.onMoveEnd = () => {
            playerHasPlayed = true;
            resolve();
        };
    });
};

// ====== Enemy Class ======
class EnemyBot {
    constructor(positionE){
        this.cards = [];
        this.position = positionE;
    }

    addCard(card){
        this.cards.push(card);
    }

    removeCard(card){
        this.cards = this.cards.filter(c => c !== card);
    }

    chooseCard(){
        const playable = this.cards.filter(c => {
            let suit = c[0];
            let number = c.slice(1);
            let topSuit = cardOnTop[0];
            let topNumber = cardOnTop.slice(1);

            return (suit === topSuit | number === topNumber || number === "8");
        })
        if(playable.length > 0){
            const chosen = playable[randInt(0, playable.length)];
            this.removeCard(chosen);
            cardOnTop = chosen;
            return chosen;
        }

        return null; //will have to draw card
    }

    takeTurn(){
        const chosenCard = this.chooseCard(cardOnTop);
        if(chosenCard){
            console.log(`Bot spiller ${chosenCard}`);
            this.chooseCard(cardOnTop)
        } else{
            const newCard = drawCard()
            if(newCard){
                this.addCard(newCard);
                console.log(`Bot trekker et kort`);
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
            const cardDiv = document.createElement("div");
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

async function main(){
    document.querySelector("#start-page").style.display = "none";
    document.querySelector("#game-table").style.display = "grid"; 

        // ====== DOM Elements ======
    const topCardE = document.querySelector("#card-throw");
    const bunk = document.querySelector("#card-bunk");

    // PLAYER
    const Player = new User();
    
        // ==== GAME VARIABLES ======
    let enemyPoss = [topEnemy, leftEnemy, rightEnemy];
    let botAmount = document.querySelector("#enemyCount").value;
    console.log(botAmount)

    // ====== Initial Setup ======
    topCardE.innerHTML += `<img src="Assets/Kortbilder/${cardOnTop}.png" alt=""></img>`;
    
    Player.gameSetup(topCardE, bunk);

    for(let i = 0; i < botAmount; i++){
        bots.push(new EnemyBot(enemyPoss[i]));
        for(let j = 0; j < starterCardCount; j++){
            bots[i].addCard(drawCard());
            bots[i].renderHand()
        }
    }
    for(const bot of bots){
        console.log(bot.cards)
    }

    while(true){
        playerHasPlayed = false;

        console.log("Waiting for player's turn...")

        await waitForPlayerTurn();

        console.log("Player played! Time for the bots!")

        Player.canPlay = false;
        for(const bot of bots){
            bot.takeTurn();
            console.log("orahhhhhhhhhhhhhhhhhhhhhh");
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        Player.canPlay = true;
    }
    
}

document.querySelector("#startBtn").addEventListener("click", main);