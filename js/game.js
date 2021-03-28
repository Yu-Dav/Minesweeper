'use strict';

const MINE = '💣';
const FLAG = '🚩';

var gBoard;
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {};
var gMinesPlaced = false;
var gIsTimerOn = false;

function init(level = gLevel.size) {
    gBoard = buildBoard(level);
    renderBoard(gBoard);
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        lives: 3,
        isHintUsed: false,
        isMarkManually: false,
        secsPassed: 0
    }
    gMinesPlaced = false;
    renderImg('start');
    updateScore();
    updateLives();
    gHintCounter = 0;
    removeHintAura()
    renderHighScore(gLevel.size);
    // renderHighScores();
    var elTimerBox = document.querySelector('.timer-container span');
    elTimerBox.innerText = '';
    clearInterval(gInterval);
    gIsTimerOn = false;
}

function changeLevel(level) {
    clearInterval(gInterval);
    gIsTimerOn = false;
    gLevel.size = level;
    if (level === 4) gLevel.mines = 2;
    if (level === 8) gLevel.mines = 12;
    if (level === 12) gLevel.mines = 30;
    init(level)
}

function placeMines(posI, posJ) {
    if (gMinesPlaced) return;
    var emptyCells = getEmptyCells(gBoard);
    var numOfMines = gLevel.mines;
    for (var i = 0; i < numOfMines; i++) {
        gMinesPlaced = true;
        var emptyCell = emptyCells.pop();
        if (emptyCell.i === posI && emptyCell.j === posJ) emptyCell = emptyCells.pop(); // choose another cell is the rand cell is the clicked cell
        var boardPos = gBoard[emptyCell.i][emptyCell.j];
        boardPos.isMine = true;
        var strHTML = `<span class="clicked">${MINE}</span>`
        renderCell(emptyCell, strHTML)
    }
}

function setMinesNegsCount(board, pos) {
    var minesCount = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === pos.i && j === pos.j) continue;
            if (board[i][j].isMine) {
                minesCount++;
                board[pos.i][pos.j].minesAroundCount = minesCount;
            }
        }
    }
    var strHTML = `<span class="clicked">${gBoard[pos.i][pos.j].minesAroundCount}</span>`;
    renderCell(pos, strHTML);
}

function cellClicked(ev, elCell, i, j) {
    var pos = getPos(i, j);
    var cell = gBoard[i][j];

    if (!gGame.isOn) return;
    if (!gGame.shownCount) { // running on first click only
        placeMines(i, j);
        updateScore();
        if (!gIsTimerOn) runTimer();
    }
    if (gGame.isHintUsed) { /// click after using a hint
        revealCell(i, j);
        return;
    }
    if ((ev.button === 2 || gGame.isMarkManually) && (!cell.isShown || cell.isMine)) { // on right click
        markCell(pos, elCell);
        return;
    }
    if (cell.isMine && !cell.isMarked) { /// in mine clicked
        onMineClick(pos, cell);
        return;
    }
    if (ev.button === 0 && !cell.isMarked) { // left click
        onLeftClick(pos, cell, elCell);
    }
}

function onMineClick(pos, cell) {
    gGame.lives--;
    var audio = document.querySelector("audio");
    audio.play();
    cell.isShown = true;
    var strHTML = `<span>${MINE}</span>`
    renderCell(pos, strHTML)
    updateLives()
}

function onLeftClick(pos, cell, elCell) {
    gGame.shownCount++
    setMinesNegsCount(gBoard, pos);
    cell.isShown = true;
    if (cell.minesAroundCount === 0) expandShown(pos.i, pos.j);
    var elSpan = elCell.querySelector('span');
    elSpan.classList.remove('clicked')
}

function markCell(pos, elCell) {
    var cell = gBoard[pos.i][pos.j];
    if (!cell.isMarked) {
        var elSpan = elCell.querySelector('span');
        elSpan.classList.toggle('clicked');
        cell.isMarked = true;
        gGame.markedCount++;
        var strHTML = `<span>${FLAG}</span>`;
        renderCell(pos, strHTML);
    } else {
        cell.isMarked = false;
        gGame.markedCount--;
        var strHTML = `<span class="clicked"></span>`;
        renderCell(pos, strHTML);
    }
    if (gGame.isMarkManually) removeFlagAura()
    updateScore();
    checkifVictory();
}

function checkifVictory() {
    var minesCounter = 0;
    var correctMarkCounter = 0;
    var totalMarked = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) minesCounter++;
            if (currCell.isMarked) totalMarked++;
            if (currCell.isMarked && currCell.isMine) correctMarkCounter++;
        }
    }
    if (minesCounter === correctMarkCounter && totalMarked <= minesCounter) Victory();
}

function Victory() {
    gGame.isOn = false;
    clearInterval(gInterval);
    gIsTimerOn = false;
    var audio = document.querySelector(".victory-aud");
    audio.play();
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell${i}_${j}`)
                elCell.classList.toggle('.clicked');
                var pos = getPos(i, j);
                setMinesNegsCount(gBoard, pos);
                var strHTML = `<span class="">${gBoard[i][j].minesAroundCount}</span>`;
                renderCell(pos, strHTML);
            }
        }
    }
    checkHighScore();
    renderImg('win');
}

function gameOver() {
    gGame.isOn = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                var pos = getPos(i, j)
                var strHTML = `<span>${MINE}</span>`
                renderCell(pos, strHTML);
            }
        }
    }
    renderImg('sad');
    clearInterval(gInterval);
    gIsTimerOn = false;
    checkHighScore();
}



