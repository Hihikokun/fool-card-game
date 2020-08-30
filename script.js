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

function playerTakes() {
    document.querySelectorAll(".played_card").forEach(element => {
        botHand.push(playedCards[playedCards.length - 1]);
        playedCards.pop();
        element.classList.add("player_hand");
        element.removeAttribute("id");
        element.id = `p${botHand.length + 1}c`;
        element.classList.remove("played_card");
    });
    console.log("playerTakes() exectued");
}

function endTurn() {
    console.log(`%c${whoTurn}`, 'color: red');
    console.log(hasResponse);
    if (whoTurn === "Player") {
        if (hasResponse === false) {
            botTakes();
            console.log("Player turn again")
        } else if (hasResponse) {
            whoTurn = "Bot";
            console.log("Bot turn now")
            playedCards.length = 0;
            playedValues.length = 0;
            botExtra.length = 0;
            document.querySelectorAll(".played_card").forEach(element => {
                element.removeAttribute("class");
                element.removeAttribute("id");
                element.classList.add("discarded");
            });
        }
    } else if (whoTurn === "Bot") {
        if (hasResponse === false) {
            console.log("Bot's turn again");
            playerTakes();
        } else if (hasResponse) {
            whoTurn = "Player";
            console.log("Player turn now");
            console.log(`%c${whoTurn}`, 'color: red');
            playedCards.length = 0;
            playedValues.length = 0;
            botExtra.length = 0;
            document.querySelectorAll(".played_card").forEach(element => {
                element.removeAttribute("class");
                element.removeAttribute("id");
                element.classList.add("discarded");
            });
        }
    }
    while (playerHand.length < 6) {
        playerDraw();
    }
    while (botHand.length < 6) {
        botDraw();
    }
    renderAfterDraw();
    numTurns = 0;
    if (whoTurn === "Player") {
        playerTurnFunc();
    } else botStart();
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

function botFindPlay() {
    numTurns++;
    document.querySelectorAll(".player_hand").forEach(card => {
        card.removeAttribute('onclick', "startTurn(this);");
    });
    console.log("Bot turn");
    var botPlay; //Array element
    botHand.forEach(element => {
        if (element[1] != trumpCard) {
            if (botPlay === undefined || element[0] <= botPlay[0] || botPlay[1] === trumpCard) {
                botPlay = element;
            }
        } else if (botPlay === undefined && element[1] === trumpCard) {
            botPlay = element;
        }
    })
    botHand.splice(botHand.indexOf(botPlay), 1);
    playedCards.push(botPlay);
    playedValues.push(botPlay[0]);
    playerHand.splice(playerHand.indexOf(botPlay), 1);
    console.log(playedCards);
    document.querySelectorAll(".bot_hand").forEach(card => {
        if (parseInt(card.dataset.value) === botPlay[0] && card.dataset.suit === botPlay[1]) {
            card.id = `a${numTurns}c`;
            card.classList.add(".played_card");
            card.classList.remove(".bot_hand");
            console.log(botHand);
        }
    })
    return botPlay;
}

async function botStart() {
    let bot_card = await botFindPlay();
    console.log(bot_card);
    await playerDefense(bot_card);
    console.log("Waiting for player response");
}

async function botContinue() {
    console.log("Waiting for bot extra");
    await botFindExtra();
    console.log("?");
    console.log("!");
    if (botExtra.length > 0) {
        var botCard = await botPlayExtra();
        await playerDefense(botCard);
        console.log(botExtra);
    } else {
        console.log("No extras to play")
    }
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

function botFindExtra() {
    playedValues.forEach(value => {
        console.log(botHand);
        botHand.forEach(arr => {
            if (arr[0] === value) {
                botExtra.push(arr);
                console.log(botExtra);
            }
        })
    })
}

function botPlayExtra() {
    document.querySelectorAll(".bot_hand").forEach(card => {
        if (card.dataset.suit === botExtra[0][1] && parseInt(card.dataset.value) === botExtra[0][0]) {
            console.log(botExtra[0]);
            playedValues.push(botExtra[0][0]);
            playedCards.push(botExtra[0]);
            card.classList.add("played_card");
            card.classList.remove("bot_hand");
            numTurns++;
            card.id = `a${numTurns}c`;
        }
    })
    console.log(botExtra[0]);
    console.log("^ botExtra[0]")
    console.log(botExtra);
    return botExtra[0];
}

function playerDefense(el) {
    document.querySelectorAll(".player_hand").forEach(card => {
        if (card.dataset.suit === el[1] && card.dataset.value > el[0]) {
            card.setAttribute('onclick', "playerResponse(this);")
        } else if (toString(card.dataset.suit) === toString(trumpCard)) {
            if (el[1] === trumpCard && card.dataset.value > el[0]) {
                card.setAttribute('onclick', "playerResponse(this);")
            } else if (el[1] != trumpCard && toString(card.dataset.suit) === toString(trumpCard)) {
                card.setAttribute('onclick', "playerResponse(this);")
            }
        }
    })
}

function playerResponse(el) {
    return new Promise((resolve, reject) => {
        document.querySelectorAll(".player_hand").forEach(card => {
            card.removeAttribute('onclick', "playerResponse(this);");
        })
        var value = parseInt(el.dataset.value);
        var suit = el.dataset.suit;
        var refCard; //Array element, NOT span
        // Dealing with arrays
        playerHand.forEach(card => {
            if (card[0] === value && card[1] === suit) {
                refCard = card;
            }
        });
        console.log(`The player responded with ${refCard}`);
        playedCards.push(refCard);
        playedValues.push(parseInt(value));
        console.log(playedCards);
        playerHand.splice(playerHand.indexOf(refCard), 1);
        el.id = `d${numTurns}c`;
        el.classList.add("played_card");
        el.classList.remove("player_hand");
        hasResponse = true;
        resolve(botContinue());
    })
}

function playCard(el) {
    return new Promise((resolve, reject) => {
        numTurns++;
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
        playerHand.splice(playerHand.indexOf(refCard), 1);
        // Dealing with span elements
        cards.forEach(element => {
            element.removeAttribute("onclick", "startTurn(this);");
        });
        el.id = `a${numTurns}c`;
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
            hasResponse = false;
            console.log("No responses at all!");
            findExtra();
            reject("No response");
        } else {
            hasResponse = true;
            playedCards.push(response);
            playedValues.push(response[0]);
            console.log(playedCards);
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
        respCard.id = `d${numTurns}c`;
        respCard.classList.add("played_card");
        hasResponse = true;
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

var botExtra = new Array;

var hasResponse = false;

var numTurns = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Game Logic

async function startGame() {
    await deck.shuffle(); //Done
    await renderEverything(); //Done
    if (whoTurn === "Player")
        playerTurnFunc();
    else botStart();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////