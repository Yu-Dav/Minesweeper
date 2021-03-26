'use strict';

var gInterval;

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    return board;
}

function renderBoard(board) {
    var strHtml = '<table border="0"><tbody>';
    var str = '.';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board.length; j++) {
            strHtml += `<td class =" cell${i}_${j}" onmousedown="cellClicked(event,this,
            ${i},${j})"><span class="clicked">${str}</span></td>`
        }
        strHtml += '<tr>';
    }
    strHtml += '</tbody ></table >';
    var elTable = document.querySelector('.board-container');
    elTable.innerHTML = strHtml;
}

function renderCell(location, value) {
    // is the cell's mine count is 0 -> render with empty content
    // if (gBoard[location.i][location.j].minesAroundCount === 0 && !gBoard[location.i][location.j].isMine ) value = `<span>${EMPTY}</span>`;
    var elCellX = document.querySelector(`.cell${location.i}_${location.j}`)
    elCellX.innerHTML = value;
}

function renderScore(dif) {
    var elScoreBox = document.querySelector('.score-container span')
    elScoreBox.innerText = dif
}
function renderImg(sit) {
    var elStatusBar = document.querySelector('.status-icon-container');
    var strHTML = `<div class="status-icon-container" onclick="init()"><img src="img/${sit}.png"></div>`;
    switch (sit) {
        case 'win':
            strHTML += ('Victory!! Click to celebrate and play again!');
            break;
        case 'sad':
            strHTML += ('</br>Oh no! Click above to make the sad guy happy and play again');
            break;
        case 'start':
            strHTML += ('</br>Enjoy!');
            break;
        default:
            console.log('no imag')
            break;
    }
    elStatusBar.innerHTML = strHTML

}



function runTimer() {
    gIsTimerOn = true;
    var elTimerBox = document.querySelector('.timer-container span')
    var start = Date.now();
    var millis = 0;
    gInterval = setInterval(() => {
        millis = Date.now() - start;
        millis = millis / 1000;
        millis = millis.toFixed(0);
        elTimerBox.innerText = millis;
    }, 1000);
}

function getEmptyCells(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCellPos = { i, j };
            emptyCells.push(currCellPos)
        }
    }
    emptyCells = shuffle(emptyCells)
    return emptyCells;
}

function shuffle(arr) {
    var items = arr;
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getPos(i, j) {
    var pos = {
        i: i,
        j: j
    }
    return pos
}

function updateScore() {
    var mineCount = 0;
    var markedCount = gGame.markedCount;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) mineCount++
        }
    }
    var dif = mineCount - markedCount;
    renderScore(dif);
}

function updateLives() {
    if (!gGame.isOn) return;
    var elSpan = document.querySelector('.lives-container span');
    if (gGame.lives === 3) elSpan.innerHTML = ('1 2 <u>3</u>');
    if (gGame.lives === 2) elSpan.innerHTML = ('1 <u>2</u> <s>3<s/>');
    if (gGame.lives === 1) elSpan.innerHTML = ('<u>1<u/> <del>2 3</del>');
    if (!gGame.lives) {
        elSpan.innerHTML = ('💩');
        gameOver();
    }
}

var noContext = document.getElementById('noContextMenu');

noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
});