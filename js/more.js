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
    setTimeout(function () { hideCells(rowIdx, colIdx); }, 2500);
}

function hideCells(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (!gBoard[i][j].isShown) {
                var pos = getPos(i, j)
                var strHTML = `<span></span>`
                renderCell(pos, strHTML);
                //// <-----> Hidding marked cells - need to fix!
            }
        }
    }
}

function markCellManually(elFlag) {
    if (gGame.isMarkManually) {
        // console.log ('activte yet disabled')
        removeFlagAura();
        return
    }
    gGame.isMarkManually = true;
    console.log('mark manually =')
    elFlag.classList.add('flag-clicked');
}

function removeFlagAura() {
    gGame.isMarkManually = false;
    var elFlag = document.querySelector('.mark-manually-container');
    elFlag.classList.remove('flag-clicked');
}



function useHint(elHintIcon) {
    if (!gGame.shownCount) return;
    if (gHintCounter > 2) return;
    gGame.isHintUsed = true;
    console.log('gHintCounter  =', gHintCounter)
    gHintCounter++;
    elHintIcon.classList.add('hint-clicked');
    // add text below
}

function checkHighScore() {
    var elTimerBox = document.querySelector('.timer-container span');
    var timeTaken = elTimerBox.innerHTML;
    var level = gLevel.size;
    // var level = gLevel.size + '';
    console.log('level =', level)
    if (!sessionStorage) {
        sessionStorage.setItem(level, timeTaken)
    } else {
        var currHighTime = sessionStorage.getItem("12");
        console.log(currHighTime)
        if (timeTaken > currHighTime) {
            // sessionStorage.removeItem("12")
            /// remove the current high time
            // add the new high time
        }
    }
    var score = {
        level: level,
        time: timeTaken
    }
    renderHighScore(score)
}

function renderHighScore(score) {
    var level = score.level;
    var timeTaken = score.time;
    var elBestTimeSlot = document.querySelector(`#l${level}`);
    elBestTimeSlot.innerHTML = timeTaken;

}
