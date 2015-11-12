'use strict';

/* global getWinner */

// initial sate
var state = {
  startGameDisplay: null,
  mainGameDisplay: null,
  count: null,
  cellArray: null,
  xo: null,
  winnerMsg: null
};

// Check if state exists
var game = localStorage.getItem('game');
if (game) {
  state = JSON.parse(game);
}

window.addEventListener('load', function load() {
  var d = document;
  var startGameDiv = d.querySelector('.startGame');
  var startGameBtn = d.querySelector('.generateField');

  var startNewGameBtn = d.querySelector('.startNewGame');
  var winnerMsg = d.querySelector('.winner-message');
  var mainGame = d.querySelector('.mainGame');
  var field = d.querySelector('.field');
  var cells = [];
  var xo;
  var result;

  function setState() {
    var cell;
    var i;
    var cellArray = [];
    state.startGameDisplay = startGameDiv.style.display;
    state.mainGameDisplay = mainGame.style.display;
    state.count = 3;
    state.xo = xo;
    state.winnerMsg = winnerMsg.textContent;

    for (i = 0; i < cells.length; i++) {
      cell = cells[i];
      if (cell.classList.contains('x')) {
        cellArray[i] = 'x';
      } else if (cell.classList.contains('o')) {
        cellArray[i] = 'o';
      }
    }
    state.cellArray = cellArray;

    localStorage.setItem('game', JSON.stringify(state));
  }

  function isFreeCell() {
    var cell;
    var i;
    var cellCount;
    cellCount = 3 * 3;
    for (i = 0; i < cells.length; i++) {
      cell = cells[i];
      if (cell.classList.contains('x') || cell.classList.contains('o')) {
        cellCount--;
      }
    }
    return cellCount >= 0;
  }

  function createField() {
    var d = document;
    var row;
    var cell;
    var i;
    var j;
    for (i = 0; i < 3; i++) {
      row = d.createElement('div');
      row.className = 'row';
      row.dataset.id = i;
      field.appendChild(row);
      j = 0;
      for (; j < 3; j++) {
        cell = d.createElement('div');
        cell.className = 'cell';
        cell.dataset.id = i + '-' + j;
        row.appendChild(cell);
      }
    }
    mainGame.appendChild(field);
    mainGame.style.display = 'block';
  }

  function clickCell() {
    var target = event.target;
    if (target.classList.contains('field') || target.classList.contains('x') || target.classList.contains('o')) {
      return;
    }
    target.classList.add(xo);
    if (xo === 'x') {
      xo = 'o';
    } else {
      xo = 'x';
    }

    result = getWinner();
    if (result === 'x') {
      field.removeEventListener('click', clickCell);
      winnerMsg.textContent = 'X is Winner!';
    }
    if (result === 'o') {
      field.removeEventListener('click', clickCell);
      winnerMsg.textContent = 'O is Winner!';
    }
    if (!isFreeCell()) {
      field.removeEventListener('click', clickCell);
    }
    setState();
    event.stopPropagation();
  }

  function restoreGame() {
    var i = 0;
    if (game) {
      startGameDiv.style.display = state.startGameDisplay;
      mainGame.style.display = state.mainGameDisplay;
      xo = state.xo;
      winnerMsg.textContent = state.winnerMsg;
      createField();
      cells = document.querySelectorAll('.cell');
      for (; i < cells.length; i++) {
        if (state.cellArray[i] === 'x') {
          cells[i].classList.add('x');
        }
        if (state.cellArray[i] === 'o') {
          cells[i].classList.add('o');
        }
      }
      field.addEventListener('click', clickCell);
    }
  }

  restoreGame();

  startGameBtn.addEventListener('click', function startGame() {
    createField();
    startGameDiv.style.display = 'none';
    field.addEventListener('click', clickCell);
    xo = 'x';
    cells = document.querySelectorAll('.cell');
    setState();
  });

  startNewGameBtn.addEventListener('click', function startNewGame() {
    var cell;
    var i = 0;
    for (; i < cells.length; i++) {
      cell = cells[i];
      cell.classList.remove('x');
      cell.classList.remove('o');
    }
    winnerMsg.textContent = '';
    field.addEventListener('click', clickCell);
    xo = 'x';
    cells = document.querySelectorAll('.cell');
    setState();
  });
});
