/*
startTurn(el) (FUNCTION 1) A card from the player's hand is clicked on, which will then be played and start the turn. It will also style the card and remove it from the player.hand array
botResponse() (FUNCTION 2) The function will be a response from the bot, which will take the card given by (FUNCTION 1) as a parameter. The function will then play a response or return null, in which case (FUNCTION 3) is executed
showOptions() (FUNCTION 3) The function will look through the player's hand and give all cards that are able to be played an onclick (FUNCTION 4) attribute as well as style the cards
addExtra() (FUNCTION 4) The function will be executed when the player clicks on a card, and the card that is clicked will be affected by this function. It will be styled, removed from the player.hand array
endTurn() (FUNCTION 5) The function will end the turn, which will remove all played cards from the board and the playedCards array. Then each player will draw until they have 6 cards in hand, and the turn is either returned to the previous player or passed.
*/

function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    return [value, suit];
}

function makeDeck() {
    var cards = new Array;
    for (let i = 6; i < 15; i++) {
        cards.push(Card(i, 'spade'),Card(i, 'diamonds'),Card(i, 'clubs'),Card(i, 'hearts'));
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
    var value = parseInt(el.innerHTML.substr(0, el.innerHTML.indexOf('<')));
    var suit = el.innerHTML.substr(el.innerHTML.indexOf('>') + 1, el.innerHTML.length); 
    var cards = document.querySelectorAll('span');
    var refCard;
    player.hand.forEach(card => {
        if(card[0] === value && card[1] === suit) {
            refCard = card;
        }
    })
    playedCards.push(refCard);
    playedValues.push(refCard[0].toString());
    player.hand.splice(player.hand.indexOf(refCard),1);
    cards.forEach(element => {
        element.removeAttribute("onclick", "startTurn(this)");
    });
    el.id = `a${playedCards.length}c`;
    el.classList.add("played_card");
    el.classList.remove("player_hand");
    var response = botDefense(refCard);
    if(response === undefined) {
        console.log("No response");
        addExtra();
        return null;
    }
    else {
        var respLocation = bot.hand.indexOf(response);
        bot.hand.splice(respLocation, 1);
        var respCard = document.getElementById(`b${respLocation + 1}c`);
        respCard.id = `d${playedCards.length/=2}c`;
        respCard.classList.add("played_card");
        console.log(bot.hand);
        addExtra();
    }
}

function botDefense(card) {
    var num = card[0];
    var suit = card[1];
    var response;
    bot.hand.forEach(element => {
        if(suit === trumpCard[1] && element[1] === suit && element[0] > num) {
            if(response === undefined || element[0] < response[0]) {
                response = element;
            } 
        }
        else if(suit != trumpCard[1] && element[1] === suit && element[0] > num) {
            if(response === undefined || element[0] < response[0] || response[1] === trumpCard[1]) {
                response = element;
            }
        }
        else if(suit != trumpCard[1] && element[1] === trumpCard[1]) {
            if(response === undefined || (response[1] === trumpCard[1] && element[0] > response[0])) {
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
        console.log(playedCards.length);
        console.log(playedCards[1], playedCards[0]);
        return response;
}

function endTurn() {
    document.querySelectorAll(".played_card").forEach(element => {
        if(element.classList.contains(".played_card")) {
            var num = element.innerHTML.substr(0, element.innerHTML.indexOf('<'));
            var suit = element.innerHTML.substr(element.innerHTML.indexOf('>') + 1, element.innerHTML.length); 
            console.log(suit);
            console.log(num);
            console.log("yikes");
        }
        element.removeAttribute("id");
        element.removeAttribute("class");
        element.classList.add("discarded");
    });
    console.log("crazy")
    
}


function addExtra() {
        document.querySelectorAll(".player_hand").forEach(element => {
            if(playedValues.includes(element.innerHTML.substr(0,element.innerHTML.indexOf("<")))) {
                element.classList.add("playable_card");
                element.setAttribute('onclick', "playExtra(this)");
                console.log("Pog");
                if(element.innerHTML.substr(element.innerHTML.indexOf('>') + 1, element.innerHTML.length) === suit) {
                    console.log("redundant");
                    element.classList.remove("playable_card");
                }
            }
    });
}

/* function drawCards() {
    while(player.hand.length < 6) {
        player.hand.push(deck.cards[i]);
        deck.cards.splice(i, 1);
        console.log("nice");
        if(deck.cards.length <= 0) {
            break;
        }
    }
    console.log(player.hand);
}
*/

function playExtra(el) {
    el.classList.add(".played_card");
    playedCards.push(el);
    el.id = `a${playedCards.length}c`
    el.removeAttribute('onclick', "playExtra(this)");
    console.log("You clicked on me");
}


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

var player = {
    hand: drawHand()
}

var bot = {
    hand: drawHand(),
}

// Global Variables

var trumpCard = pickTrumpCard();

var firstPlayer = determineOrder();

var whoTurn = firstPlayer;

var outcome = checkWin();

var playedCards = new Array;

var playedValues = new Array;

var noResponse;

function startGame() {
    deck.shuffle();
    renderDeck();
    renderPlayerHand();
    renderBotHand();
    //while(outcome = "Neither"){
    //     takeTurn();
    //     drawCards();
    //     checkWin();
    // } 
}