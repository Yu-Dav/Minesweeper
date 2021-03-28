'use strict';

var gHintCounter = 0;

function expandShown(i, j) {
    var rowIdx = i;
    var colIdx = j;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j] !== MINE && !gBoard[i][j].isShown) {
                var pos = getPos(i, j)
                setMinesNegsCount(gBoard, pos);
                gBoard[i][j].isShown = true;
                var strHTML = `<span>${gBoard[i][j].minesAroundCount}</span>`
                renderCell(pos, strHTML);
                if (gBoard[i][j].minesAroundCount === 0) expandShown(i, j);
            }
        }
    }
}

function revealCell(rowIdx, colIdx) {
    gGame.isHintUsed = false;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            var pos = getPos(i, j)
            if (!gBoard[i][j].isMine) {
                setMinesNegsCount(gBoard, pos);
                var strHTML = `<span>${gBoard[i][j].minesAroundCount}</span>`
                renderCell(pos, strHTML);
            } else {
                var strHTML = `<span>${MINE}</span>`
                renderCell(pos, strHTML);

            }
        }
    }
    setTimeout(function () { hideCells(rowIdx, colIdx); }, 1000);
}

function hideCells(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (!gBoard[i][j].isShown) {
                var pos = getPos(i, j)
                var strHTML = `<span></span>`
                if (gBoard[i][j].isMarked) strHTML = `<span>${FLAG}</span>`;
                renderCell(pos, strHTML);
            }
        }
    }
}

function markCellManually(elFlag) {
    if (gGame.isMarkManually) {
        removeFlagAura();
        return
    }
    gGame.isMarkManually = true;
    elFlag.classList.add('flag-clicked');
}

function removeFlagAura() {
    gGame.isMarkManually = false;
    var elFlag = document.querySelector('.mark-manually-container');
    elFlag.classList.remove('flag-clicked');
}



function useHint(elHintIcon) {
    if (!gGame.isOn) return;
    if (!gGame.shownCount) { /// not possible on first click
        hintUsedOnFirstClick();
        return;
    }
    if (gHintCounter > 2) return;
    gGame.isHintUsed = true;
    gHintCounter++;
    elHintIcon.classList.add('hint-clicked');
}

function hintUsedOnFirstClick() {
    var elStatusBar = document.querySelector('.status-icon-container');
    console.log('elStatusBar =', elStatusBar)
    var strHTML = `<div class="status-icon-container" onclick="init()"><img src="img/start.png">Not one the first click</div>`;
    elStatusBar.innerHTML = strHTML;

}

function removeHintAura() {
    var hints = document.querySelectorAll('.hint');
    for (var i = 0; i < hints.length; i++) {
        var currHint = hints[i];
        currHint.classList.remove('hint-clicked');
    }

}

function checkHighScore() {
    var levelPlayed = gLevel.size;
    var CurrMatchTime = gGame.secsPassed;
    if (!sessionStorage.getItem(levelPlayed)) {
        sessionStorage.setItem(levelPlayed, CurrMatchTime);
        renderHighScore(levelPlayed, CurrMatchTime);
        return;

    } else {
        var currBestTime = sessionStorage.getItem(levelPlayed);
        if (CurrMatchTime < currBestTime) {
            updateHighScore(levelPlayed, CurrMatchTime);
            // return;
        }
    }
}

function updateHighScore(level, score) {
    sessionStorage.removeItem(level);
    sessionStorage.setItem(level, score)
    renderHighScore(level, score);
}

function renderHighScore(level, score = sessionStorage.getItem(level)) {
    var elBestTimeBox = document.querySelector(`#l${level}`);
    elBestTimeBox.innerHTML = score;
}

function renderHighScores() {
    var elBestTimeBoxes = document.querySelectorAll('.level')
    for (var i = 0; i < elBestTimeBoxes.length; i++) {
        var elCurrBestTimeBoxSpan = elBestTimeBoxes[i];
        // console.log('elCurrBestTimeBoxSpan =', elCurrBestTimeBoxSpan)
    }

}