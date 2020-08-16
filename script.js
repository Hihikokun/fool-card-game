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
        card.classList.add("deck");
        card.classList.add(element[1]);
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
        card.classList.add("face_up_card");
        card.classList.add("player_hand");
        card.classList.add(element[1]);
        card.id = `p${index + 1}c`;
        card.innerHTML = element[0] + "<br />" + element[1];
        card.setAttribute('onclick', "startTurn(this)");
        document.body.appendChild(card);
    });
}

function renderBotHand() {
    bot.hand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.classList.add("face_up_card");
        card.classList.add("bot_hand");
        card.classList.add(element[1]);
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

function takeTurn() {
    if (whoTurn === "Player") {
        if (cardsPlayedNum <= 6) {

            cardsPlayedNum++;
        }
    } else if (whoTurn === "Bot") {}
}

function startTurn(el) {
    cardsPlayedNum = 0;
    var cards = document.querySelectorAll('span');
    cards.forEach(element => {
        element.removeAttribute("onclick", "startTurn(this)");
    });
    el.id = 'a1c';
    el.classList.add("played_card");
    playedCards.push(el.innerHTML);
    cardsPlayedNum++;
    var response = botDefense(el.innerHTML);
    if(response === null) {
        addExtra(el.innerHTML);
        return null;
    }
    else {
        var respLocation = bot.hand.indexOf(response);
        bot.hand.splice(respLocation, 1);
        var respCard = document.getElementById(`b${respLocation + 1}c`);
        respCard.id = `d${cardsPlayedNum/=2}c`;
        respCard.classList.add("played_card");
    }
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
    cardsPlayedNum = 0;
    
}


function addExtra(card) {
    drawCards();
    var num = card.substr(0, card.indexOf('<'));
    console.log(num);
    var suit = card.substr(card.indexOf('>') + 1, card.length); 
    console.log(suit);
        document.querySelectorAll(".player_hand").forEach(element => {
            if(element.innerHTML.substr(0,element.innerHTML.indexOf("<")) === num) {
                element.classList.add("playable_card");
                element.setAttribute('onclick', "playExtra(this)");
                console.log("Pog");
                if(element.innerHTML.substr(element.innerHTML.indexOf('>') + 1, card.length) === suit) {
                    console.log("redundant");
                    element.classList.remove("playable_card");
                }
            }
            else {
                console.log("sad");
            }
    });
}

function drawCards() {
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

function playExtra(el) {
    el.classList.add(".played_card");
    el.id = `a2c`
    el.removeAttribute('onclick', "playExtra(this)");
    console.log("You clicked on me");
}



//IF CARD MATCHES SUIT GO ON AND IF CARD HAS LARGER NUMBER GO ON
//IF CARD HAS NUMBER SMALLER THAN CURRENT ANSWER OR NO ANSWER GO ON
//SET THIS AS ANSWER

//IF CARD DOES NOT MATCH SUIT, IS TRUMP CARD, AND THERE IS NO ANSWER YET GO ON
//SET THIS AS ANSWER

//IF CARD DOES NOT MATCH SUIT AND IS TRUMP CARD BUT THERE IS A REPONSE
//IF CARD HAS NUMBER SMALLER THAN CURRENT ANSWER
//SET THIS AS ANSWER

function botDefense(card) {
    var num = card.substr(0, card.indexOf('<'));
    var suit = card.substr(card.indexOf('>') + 1, card.length);
    var response;
    bot.hand.forEach(element => {
        if (element[1] === suit && element[0] > num) {
            if (response === undefined || element[0] < response[0]) {
                response = element;
            }
        }
        else if (element[1] != suit && element[1] === trumpCard[1] && response === undefined) {
            response = element;
        }
        else if (element[1] != suit && element[1] === trumpCard[1] && response != undefined) {
            if (element[0] < response[0]) {
                response = element;
            }
        }
    });
    if (response === undefined) {
        console.log("No responses at all!");
        return null;
    }
    console.log(response);
    cardsPlayedNum ++;
    return response;
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

var cardsPlayedNum = 0;

var whoTurn = firstPlayer;

var outcome = checkWin();

var playedCards = new Array;

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