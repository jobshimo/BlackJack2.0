import './style.css'
import Swal from 'sweetalert2';
import _, { map } from 'underscore';

export const gameModule = (() => {
    let deck = [];
    const types = ["C", "D", "H", "S"],
        specials = ["A", "J", "Q", "K"];
    let playesScores = [];
    let playerAses = [];

    const btnNew = document.querySelector("#btnNew"),
        btnAsk = document.querySelector("#btnAsk"),
        btnStop = document.querySelector("#btnStop");

    const divCards = document.querySelectorAll(".divCards"),
        totalScore = document.querySelectorAll("small");

    const startGame = (players = 2) => {
        deck = makeDeck();
        playesScores = [];
        playerAses = [];
        for (let i = 0; i < players; i++) {
            playesScores.push(0);
            playerAses.push([]);
        }
        console.clear();
        totalScore.forEach(element => element.innerText = 0)
        divCards.forEach(element => element.innerHTML = '')
        btnAsk.disabled = false;
        btnStop.disabled = false;
    };

    const makeDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (const type of types) {
                deck.push(i + type);
            }
        }
        for (const type of types) {
            for (const special of specials) {
                deck.push(special + type);
            }
        }
        return _.shuffle(deck);
    };

    const getCard = () => {
        if (deck.length === 0) throw "No hay cartas en la bajara";
        return deck.pop();
    };

    const cardValue = (card, turn) => {
        const value = card.substring(0, card.length - 1);
        if (value === 'A') playerAses[turn].push('A');
        return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
    };

    const checkAses = (turn) => {
        if (playesScores[turn] > 21) {
            if (playerAses[turn].length > 0) {
                playerAses[turn].forEach((ases, index) => {
                    if (ases === 'A') {
                        playesScores[turn] = playesScores[turn] - 10;
                        playerAses[turn][index] = 'B';
                    }
                })
            }
        }
    }

    const getScore = (card, turn) => {
        playesScores[turn] = playesScores[turn] + cardValue(card, turn);
        checkAses(turn);
        totalScore[turn].innerText = playesScores[turn];
        return playesScores[turn];
    };

    const makeCard = (card, turn) => {
        const newCard = document.createElement("img");
        newCard.src = `./assets/cards/${card}.png`;
        newCard.classList.add("carta", "animate__animated", "animate__fadeIn", "animate__faster");
        divCards[turn].append(newCard);
    }

    const pc = (score) => {
        let pcScore = 0;

        do {
            const card = getCard();
            pcScore = getScore(card, playesScores.length - 1);
            makeCard(card, playesScores.length - 1)
        } while (score > pcScore && score <= 21);

        setTimeout(() => {
            if (pcScore === score) {
                Swal.fire(
                    'EMPATE!!!',
                    'El PC te ha igualado, no hay ganador.',
                    'warning'
                )
            } else if (score > 21) {
                Swal.fire(
                    'GANO EL PC!!!',
                    'Has perdido, lo siento.',
                    'error'
                )
            } else if (pcScore > 21) {
                Swal.fire(
                    'GANASTE!!!',
                    'Enhorabuena, has ganado.',
                    'success'
                )
            } else {
                Swal.fire(
                    'GANO EL PC!!!',
                    'Has perdido, lo siento.',
                    'error'
                )
            }
        }, 100);
    };

    btnAsk.addEventListener("click", () => {
        const card = getCard();
        const scores = getScore(card, 0);
        makeCard(card, 0)
        if (scores > 21) {

            console.warn("Perdiste Calamardo");
            btnAsk.disabled = true;
            btnStop.disabled = true;
            pc(scores);
        } else if (scores === 21) {
            console.warn("21, Buen rollo!!!");
            btnAsk.disabled = true;
            btnStop.disabled = true;
            pc(scores);
        }
    });

    btnStop.addEventListener("click", () => {
        btnAsk.disabled = true;
        btnStop.disabled = true;
        pc(playesScores[0]);
    });

    btnNew.addEventListener("click", () => {
        startGame();
    });

    return {
        start: startGame
    }


})();


gameModule.start();