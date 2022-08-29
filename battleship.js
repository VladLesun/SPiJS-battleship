let view = {
    displayMessage: function(msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.classList.add('hit');
        // cell.setAttribute('class', 'hit');
    },

    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.classList.add('miss');
        // cell.setAttribute('class', 'miss');
    }
};

/* Тест объектов view !
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");
view.displayMessage("Tap tap, is this thing on?");
*/

let model = {
    boardSize: 7, // размер сетки игрового поля
    numShips: 3, // количество кораблей в игре
    shipLength: 3, // длина каждого корабля (в клетках)
    shipsSunk: 0, // количество потопленных кораблей

    ships: [ // позиции кораблей и координаты попаданий
        { locations: ['06', '16', '26'], hits: ['', '', ''] },
        { locations: ['24', '34', '44'], hits: ['', '', ''] },
        { locations: ['10', '11', '12'], hits: ['', '', ''] }
    ],

    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);

            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('Попал!')
                if (this.isSunk(ship)) {
                    view.displayMessage('Вы потапили корабль!')
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('Промахнулся!')
        return false;
    },

    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    }
};

/* Тест объектов model !
model.fire("53");
model.fire("06");
model.fire("16");
model.fire("26");
model.fire("34");
model.fire("24");
model.fire("44");
model.fire("12");
model.fire("11");
model.fire("01");
*/


function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess === null || guess.length !== 2) {
        alert('Упс, пожалуйста, введите букву и цифру на доске.');
    } else {
        firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Упс, этого нет на доске.');
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert('Упс, это не обсуждается!');
        } else {
            return row + column;
        }
    }
    return null;
};

/* Тест ф-ции parseGuess !
console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));
*/

let controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('Вы потопили все мои корабли, в ' + this.guesses + ' попыток');
            }
        }
    }
};

/* Тест объектов controller ! 
controller.processGuess("A0");
controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");
controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");
controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");
*/

function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value.toUpperCase();
    controller.processGuess(guess);

    guessInput.value = '';
};

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
};

window.onload = init;

function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    let guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;
};