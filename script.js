function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    return [value, suit];
}

function makeDeck() {
    var cards = new Array;
    for (let i = 6; i < 15; i++) {
        cards.push(Card(i, 'spade'), Card(i, 'diamonds'), Card(i, 'clubs'), Card(i, 'hearts'));
    }
    console.log("Deck made");
    return cards;
}

function drawHand() {
    deck.shuffle();
    var hand = new Array;
    for (let i = 0; i < 6; i++) {
        hand.push(deck.cards[i]);
        deck.cards.splice(i, 1);
    }
    console.log("Hand created");
    return hand;
}

function pickTrumpCard() {
    console.log("Trump card picked")
    return deck.cards[deck.cards.length - 1];
}

function renderDeck() {
    deck.cards.forEach(element => {
        var card = document.createElement("span");
        card.dataset.value = element[0];
        card.dataset.suit = element[1];
        card.classList.add("deck", element[1]);
        card.innerHTML = element[0] + "<br />" + element[1];
        if (element === trumpCard) {
            card.classList.add("trump_card");
        }
        document.body.appendChild(card);
    });
    console.log("Deck rendered");
}

function renderPlayerHand() {
    playerHand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.dataset.value = element[0];
        card.dataset.suit = element[1];
        card.classList.add("face_up_card", "player_hand", element[1], `p${index + 1}c`);
        card.innerHTML = element[0] + "<br />" + element[1];
        document.body.appendChild(card);
    });
    console.log("Player hand rendered");
}

function renderBotHand() {
    botHand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.dataset.value = element[0];
        card.dataset.suit = element[1];
        card.classList.add("face_up_card", "bot_hand", element[1], `b${index + 1}c`);
        card.innerHTML = element[0] + "<br />" + element[1];
        document.body.appendChild(card);
    });
    console.log("Bot hand rendered");
}

function renderEverything() {
    renderDeck();
    renderPlayerHand();
    renderBotHand();
    console.log("Cards rendered");
}

function determineOrder() {
    var bTrump = 20;
    var pTrump = 20;
    botHand.forEach(function (element, index) {
        if (element[1] === trumpCard[1]) {
            if (element[0] < bTrump) {
                bTrump = trumpCard[0];
            }
        }
    });
    playerHand.forEach(function (element, index) {
        if (element[1] === trumpCard[1]) {
            if (element[0] < pTrump) {
                pTrump = trumpCard[0];
            }
        }
    });
    if (bTrump < pTrump) {
        console.log("Bot goes first");
        playerTurn = false;
        return "Bot";
    } else if (pTrump < bTrump) {
        console.log("Player goes first");
        playerTurn = true;
        return "Player";
    } else {
        console.log("Coin toss");
        var num = Math.floor((Math.random() * 2)) + 1;
        if (num === 2) {
            console.log("The Bot won the coin toss")
            playerTurn = false;
            return "Bot";
        } else {
            console.log("The Player won the coin toss")
            playerTurn = true;
            return "Player";
        }
    }
}

function checkWin() {
    if (deck.cards.length === 0 && playerHand.length === 0 && botHand.length > 0) {
        console.log("The Player won");
        return "Victory";
    } else if (deck.cards.length === 0 && botHand.length === 0 && playerHand.length > 0) {
        console.log("The Bot won");
        return "Loss";
    } else if (deck.cards.length === 0 && botHand.length === 0 && playerHand.length === 0) {
        console.log("It's a draw");
        return "Draw";
    } else {
        console.log("Game in progress");
        return "Neither";
    }
}

function botTakes() {
    document.querySelectorAll(".played_card").forEach(element => {
        botHand.push(playedCards[playedCards.length - 1]);
        playedCards.pop();
        element.classList.add("bot_hand");
        element.removeAttribute("id");
        element.id = `b${botHand.length + 1}c`;
        element.classList.remove("played_card");
    });
    console.log("botTakes() exectued");
}

function endTurn() {
    if (noResponse) {
        botTakes();
    }
    if (noResponse === false) {
        playedCards.length = 0;
        document.querySelectorAll(".played_card").forEach(element => {
            element.removeAttribute("class");
            element.removeAttribute("id");
            element.classList.add("discarded");
        });
    }
    while (playerHand.length < 6) {
        playerDraw();
    }
    while (botHand.length < 6) {
        botDraw();
    }
    renderAfterDraw();
}

function addExtra() {
    document.querySelectorAll(".player_hand").forEach(element => {
        if (playedValues.includes(element.innerHTML.substr(0, element.innerHTML.indexOf("<")))) {
            element.classList.add("playable_card");
            element.setAttribute('onclick', "startTurn(this);");
            if (element.innerHTML.substr(element.innerHTML.indexOf('>') + 1, element.innerHTML.length) === suit) {
                element.classList.remove("playable_card");
            }
        }
    });
}

function playerDraw() {
    playerHand.push(deck.cards[deck.cards.length - 1]);
    console.log(deck.cards[deck.cards.length - 1]);
    deck.cards.pop();
    console.log("Player drew card")
}

function botDraw() {
    botHand.push(deck.cards[deck.cards.length - 1]);
    console.log(deck.cards[deck.cards.length - 1]);
    deck.cards.pop();
    console.log("Bot drew card")
}

function renderAfterDraw() {
    document.querySelectorAll(".player_hand").forEach(element => {
        element.remove();
    });
    document.querySelectorAll(".bot_hand").forEach(element => {
        element.remove();
    });
    console.log("Cards refreshed");
    renderPlayerHand();
    renderBotHand();
}

function playerTurnFunc() {
    if (checkWin() != "Neither") endGame(outcome);
    document.querySelectorAll(".player_hand").forEach(card => {
        card.setAttribute('onclick', "startTurn(this);");
    });
    console.log("Cards given startTurn(this)")
}

function botTurnFunc() {
    console.log("Bot turn");
}

async function startTurn(el) {
    let player_card = await playCard(el);
    console.log(player_card);
    let bot_card = await botDefense(el);
    console.log(bot_card);
    let bot_play_defense = await botResponse(bot_card);
    console.log(bot_play_defense);
    let extra = await findExtra();
    console.log(extra);
}

function playCard(el) {
    return new Promise((resolve, reject) => {
        var value = parseInt(el.dataset.value);
        var suit = el.dataset.suit;
        var cards = document.querySelectorAll('span');
        var refCard; //Array element, NOT span
        // Dealing with arrays
        playerHand.forEach(card => {
            if (card[0] === value && card[1] === suit) {
                refCard = card;
            }
        });
        console.log(`The player played ${refCard}`);
        playedCards.push(refCard);
        playedValues.push(parseInt(value));
        console.log(playedCards);
        console.log(playedValues);
        playerHand.splice(playerHand.indexOf(refCard), 1);
        // Dealing with span elements
        cards.forEach(element => {
            element.removeAttribute("onclick", "startTurn(this);");
        });
        el.id = `a${playedCards.length}c`;
        el.classList.add("played_card");
        el.classList.remove("player_hand");
        resolve(el);
    })
}

function botDefense(card) {
    return new Promise((resolve, reject) => {
        var num = card[0];
        var suit = card[1];
        var response; //Array element
        botHand.forEach(element => { //Determines the weakest possible answer
            if (suit === trumpCard[1] && element[1] === suit && element[0] > num) {
                if (response === undefined || element[0] < response[0]) {
                    response = element;
                }
            } else if (suit != trumpCard[1] && element[1] === suit && element[0] > num) {
                if (response === undefined || response[1] === trumpCard[1] || element[0] < response[0]) {
                    response = element;
                }
            } else if (suit != trumpCard[1] && element[1] === trumpCard[1]) {
                if (response === undefined || (response[1] === trumpCard[1] && element[0] > response[0])) {
                    response = element;
                }
            }
        });
        if (response === undefined) {
            noResponse = true;
            console.log("No responses at all!");
            findExtra();
            reject("No response");
        } else {
            noResponse = false;
            playedCards.push(response);
            playedValues.push(response[0]);
            console.log(playedCards);
            console.log(playedValues);
            resolve(response);
        }
    })
}

function botResponse(response) {
    return new Promise((resolve, reject) => {
        console.log(`The current cards in play are: ${playedCards}`);
        botHand.splice(botHand.indexOf(response), 1);
        console.log(`The current Bot Hand is ${botHand}`);
        var respCard = document.querySelector(`[data-value="${response[0]}"][data-suit="${response[1]}"]`);
        respCard.id = `d${playedCards.length-=1}c`;
        respCard.classList.add("played_card");
        noResponse = false;
        resolve(response);
    })
}

function findExtra() {
    return new Promise((resolve, reject) => {
        document.querySelectorAll(".player_hand").forEach(card => {
            if (playedValues.includes(parseInt(card.dataset.value))) {
                card.setAttribute('onclick', "startTurn(this);");
                card.classList.add("playable_card");
            }
        });
        resolve("Cards found");
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global Variables/Objects

var deck = {
    cards: makeDeck(),
    shuffle: function () {
        for (var i = 0; i < 1000; i++) {
            var card1 = Math.floor((Math.random() * this.cards.length));
            var card2 = Math.floor((Math.random() * this.cards.length));
            var temp = this.cards[card1];

            this.cards[card1] = this.cards[card2];
            this.cards[card2] = temp;
        }
        console.log("Deck Shuffled");
    }
}


var playerHand = drawHand();

var botHand = drawHand();

var trumpCard = pickTrumpCard();

var firstPlayer = determineOrder();

var whoTurn = firstPlayer;

var outcome = checkWin();

var playedCards = new Array;

var playedValues = new Array;

var discardedCards = new Array;

var noResponse = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Game Logic

function startGame() {
    deck.shuffle(); //Done
    renderEverything(); //Done
    //if (playerTurn) 
    playerTurnFunc();
    //else botTurnFunc();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////