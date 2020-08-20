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
    return cards;
}

function drawHand() {
    deck.shuffle();
    var hand = new Array;
    for (let i = 0; i < 6; i++) {
        hand.push(deck.cards[i]);
        deck.cards.splice(i, 1);
    }
    return hand;
}

function drawCards() {
    if (player.hand.length >= 6) {
        return null;
    }
    for (var j = player.hand.length; j < 7; j++) {
        player.hand.push(deck.cards[0]);
        deck.cards.splice(0, 1);
        renderHand();
    }
}

function pickTrumpCard() {
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
}

function renderPlayerHand() {
    player.hand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.classList.add("face_up_card", "player_hand", element[1]);
        card.id = `p${index + 1}c`;
        card.innerHTML = element[0] + "<br />" + element[1];
        card.setAttribute('onclick', "startTurn(this)");
        document.body.appendChild(card);
    });
}

function renderBotHand() {
    bot.hand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.classList.add("face_up_card", "bot_hand", element[1]);
        card.id = `b${index + 1}c`;
        card.innerHTML = element[0] + "<br />" + element[1];
        document.body.appendChild(card);
    });
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
    bot.hand.forEach(function (element, index) {
        if (element[1] === trumpCard[1]) {
            if (element[0] < bTrump) {
                bTrump = trumpCard[0];
            }
        }
    });
    player.hand.forEach(function (element, index) {
        if (element[1] === trumpCard[1]) {
            if (element[0] < pTrump) {
                pTrump = trumpCard[0];
            }
        }
    });
    if (bTrump < pTrump) {
        console.log("Bot goes first!");
        return "Bot";
    } else if (pTrump < bTrump) {
        console.log("Player goes first!");
        return "Player";
    } else {
        console.log("Time for a coin toss!");
        var num = Math.floor((Math.random() * 2)) + 1;
        if (num === 2) {
            console.log("The Bot won the coin toss!")
            return "Bot";
        } else {
            console.log("The Player won the coin toss!")
            return "Player";
        }
    }
}

function checkWin() {
    if (deck.cards.length === 0 && player.hand.length === 0) {
        console.log("The Player won!");
        return "Victory";
    } else if (deck.cards.length === 0 && bot.hand.length === 0) {
        console.log("The Bot won!");
        return "Loss";
    } else {
        console.log("The game goes on!");
        return "Neither";
    }
}

//When a card is clicked on it is passed into a function
//The function will give the card the class "played_card" and the id "a1c"
//The function will remove the card's reference from the player.hand array
//The function will add the card's reference to the playedCards array
//Trigger a bot response

function startTurn(el) {
    playedCards.length = 0;
    var value = parseInt(el.innerHTML.substr(0, el.innerHTML.indexOf('<')));
    var suit = el.innerHTML.substr(el.innerHTML.indexOf('>') + 1, el.innerHTML.length);
    var cards = document.querySelectorAll('span');
    var refCard;
    player.hand.forEach(card => {
        if (card[0] === value && card[1] === suit) {
            refCard = card;
        }
    })
    playedCards.push(refCard);
    playedValues.push(refCard[0].toString());
    player.hand.splice(player.hand.indexOf(refCard), 1);
    cards.forEach(element => {
        element.removeAttribute("onclick", "startTurn(this)");
    });
    el.id = `a${playedCards.length}c`;
    el.classList.add("played_card");
    el.classList.remove("player_hand");
    var response = botDefense(refCard);
    if (response === undefined) {
        console.log("No response");
        addExtra();
        return null;
    } else {
        var respLocation = bot.hand.indexOf(response);
        bot.hand.splice(respLocation, 1);
        var respCard = document.getElementById(`b${respLocation + 1}c`);
        respCard.id = `d${playedCards.length/=2}c`;
        respCard.classList.add("played_card");
        console.log(bot.hand);
        console.log("There is a response");
        addExtra();
    }
}

function botDefense(card) {
    var num = card[0];
    var suit = card[1];
    var response = undefined;
    bot.hand.forEach(element => {
        if (suit === trumpCard[1] && element[1] === suit && element[0] > num) {
            if (response === undefined || element[0] < response[0]) {
                response = element;
            }
        } else if (suit != trumpCard[1] && element[1] === suit && element[0] > num) {
            if (response === undefined || element[0] < response[0] || response[1] === trumpCard[1]) {
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
        return undefined;
    }
    noResponse = false;
    playedCards.push(response);
    playedValues.push(response[0].toString());
    return response;
}

function botTakes() {
    for (var i = 0; i < playedCards.length; i++) {
        bot.hand.push(playedCards[i]);
        document.querySelectorAll(".played_card").forEach(element => {
            element.classList.add("bot_hand");
            element.removeAttribute("id");
            element.id = `b${bot.hand.length + i}c`;
            element.classList.remove("played_card");
        })
    }
    console.log(bot.hand);
    noResponse = true;
}

function endTurn() {
    if (noResponse = false) {
        document.querySelectorAll(".played_card").forEach(element => {
            element.removeAttribute("id");
            element.removeAttribute("class");
            element.classList.add("discarded");
        });
        console.log("crazy");
    }
    console.log("ok?");
    if (noResponse = true) {
        botTakes();
    }
    while (player.hand.length < 6) {
        playerDraw();
    }
    while (bot.hand.length < 6) {
        botDraw();
    }
    playedCards.length = 0;
    console.log(player.hand);
    renderAfterDraw();
}


function addExtra() {
    document.querySelectorAll(".player_hand").forEach(element => {
        if (playedValues.includes(element.innerHTML.substr(0, element.innerHTML.indexOf("<")))) {
            element.classList.add("playable_card");
            element.setAttribute('onclick', "playExtra(this)");
            if (element.innerHTML.substr(element.innerHTML.indexOf('>') + 1, element.innerHTML.length) === suit) {
                console.log("redundant");
                element.classList.remove("playable_card");
            }
        }
    });
}

function playerDraw() {
    player.hand.push(deck.cards[deck.cards.length - 1]);
    console.log("Player drew card")
}

function botDraw() {
    bot.hand.push(deck.cards[deck.cards.length - 1]);
    console.log("Bot drew card")
}

function renderAfterDraw() {
    document.querySelectorAll(".player_hand").forEach(element => {
        element.remove();
    });
    document.querySelectorAll(".bot_hand").forEach(element => {
        element.remove();
    });
    console.log("cards refreshed");
    renderPlayerHand();
    renderBotHand();
}

function playExtra(el) {
    el.classList.add(".played_card");
    playedCards.push(el);
    el.id = `a${playedCards.length}c`
    el.removeAttribute('onclick', "playExtra(this)");
    console.log("You clicked on me");
    var value = parseInt(el.innerHTML.substr(0, el.innerHTML.indexOf('<')));
    var suit = el.innerHTML.substr(el.innerHTML.indexOf('>') + 1, el.innerHTML.length);
    var refCard;
    player.hand.forEach(card => {
        if (card[0] === value && card[1] === suit) {
            refCard = card;
        }
    })
    var response = botDefense(refCard);
    if (response === undefined) {
        console.log("No response");
        addExtra();
        botTakes();
        endTurn();
        return null;
    } else {
        var respLocation = bot.hand.indexOf(response);
        bot.hand.splice(respLocation, 1);
        var respCard = document.getElementById(`b${respLocation + 1}c`);
        respCard.id = `d${(playedCards.length + 1)/2}c`;
        respCard.classList.add("played_card");
        console.log(bot.hand);
        addExtra();
    }
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


var player_hand = drawHand();

var bot_hand = drawHand();

var trumpCard = pickTrumpCard();

var firstPlayer = determineOrder();

var whoTurn = firstPlayer;

var outcome = checkWin();

var playedCards = new Array;

var playedValues = new Array;

var noResponse = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Game Logic

function startGame() {
    deck.shuffle(); //Done
    renderEverything(); //Done
    while (outcome = "Neither") {
        if(playerTurn = true) {
            playerTurn();
            endTurn();
        }
        else {
            botTurn();
            endTurn();
        }
    }
    endGame(outcome);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////