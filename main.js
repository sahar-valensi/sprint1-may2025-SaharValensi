const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
///
var gBoard = []
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isGameOver: false,
}

var elMinesLeft = document.querySelector(`.mines-left`)
var intervalId;
// creatBoard()
function onInit() {
    resetGame()
    gBoard = createBoard()
    renderBoard()

    elMinesLeft.innerHTML = gLevel.MINES;
}

function resetGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    clearInterval(intervalId);
}

function createBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell
        }

    }
    // board[0][1].isMine = true
    // board[2][2].isMine = true

    placeMines(board);
    console.table(board)
    return board
}

function renderBoard() {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard.length; j++) {
            const cell = gBoard[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})"
                     oncontextmenu="onCellMarked(event, ${i}, ${j})">
          
                     </td>`
        }//          ${cell.isMine ? MINE : setMinesNegsCount(gBoard, i, j)}   cellRightClicked
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.game-container')
    elContainer.innerHTML = strHTML
    // const elH2Span = document.querySelector('.h2 span')
    // elH2Span.innerHTML = gLevel.MINES
}

function resizeBoard(size) {
    // var sizeMap = {
    //     'easy': ()=> {
    //         gLevel.SIZE = 4
    //         gLevel.MINES = 2
    //     },
    //     'medium': ()=> {
    //         gLevel.SIZE = 4
    //         gLevel.MINES = 2
    //     },
    //     'hard': ()=> {
    //         gLevel.SIZE = 4
    //         gLevel.MINES = 2
    //     }
    // }

    // const sizeFunction = sizeMap[size];
    // sizeFunction();

    if (size === 'easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (size === 'medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 10
    } else {
        gLevel.SIZE = 12
        gLevel.MINES = 20
    }

    onInit();
}


/////// להגדיר פונקציות שמגדירות את התוכן של התא,לספור שכנים ולהכניס אותן לתוכן של התא,לעבוד על סימון הדגל
function setMinesNegsCount(board, CellI, CellJ) {
    var count = 0;

    for (var i = CellI - 1; i <= CellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = CellJ - 1; j <= CellJ + 1; j++) {
            if (i === CellI && j === CellJ) continue;
            if (j < 0 || j >= gLevel.SIZE) continue;
            var currCell = board[i][j];
            if (currCell.isMine) {
                count++;
            }
        }
    }
    // const elCell = document.querySelector(`.cell-${i}-${j}`)
    // elCell.classList.add('x${count}')
    return count;
}

function placeMines(board) {
    var minesPlaced = 0;
    while (minesPlaced < gLevel.MINES) {
        var randomRow = getRandomInt(0, gLevel.SIZE - 1);
        var randomCol = getRandomInt(0, gLevel.SIZE - 1);
        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true;
            minesPlaced++;
        }
        console.log(`Mine${minesPlaced}: `, randomRow, randomCol)
    }
}

// function countMinesAround(rowIdx, colIdx) {
//     var negsCount = 0;

//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i === -1) continue

//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j === -1) continue
//             if (i === rowIdx && j === colIdx) continue;
//             console.log('i', i, 'j', j)
//             if (i >= 0 && i < gBoard.length && j >= 0 && j < gBoard[0].length) {
//                 if (gBoard[i][j].isMine) {
//                     negsCount++;
//                 }
//             }
//         }
//     }
//     console.table(`'cell [${rowIdx},${colIdx}] has ${negsCount} negs'`)
//     return negsCount;
// }
//////////לסמן את הדגל עם הפונקציה,להוסיף עיצוב למספר שכנים כל אחד בצבע אחר,להגדיר את הלחיצה על הכפתור כקלאסים של חשוף ומכוסה,
function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isShown || cell.isMarked || gGame.isGameOver) return

    if (!gGame.isOn) {
        intervalId = setInterval(startTimer, 1000);
        gGame.isOn = true;
    }

    if (!cell.isShown) {
        cell.isShown = true
        elCell.innerHTML = setMinesNegsCount(gBoard, i, j)
        elCell.classList.add('x' + elCell.innerHTML.toString())
        elCell.classList.add("shown")
    }
    if (cell.isMine) {
        onGameOver()
    }

    checkVictory()
}

function onEndGame() {
    //end game state
    gGame.isGameOver = true;
    gGame.isOn = false;
    clearInterval(intervalId);
}

function onGameOver() {
    //show all mines
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add("mined")
                elCell.innerHTML = MINE
            }
        }
    }

    //end game
    onEndGame();
}

function onVictory() {
    //open modal

    //end game
    onEndGame();
}

function onCellMarked(event, i, j) {
    event.preventDefault()
    const cell = gBoard[i][j]

    if (!gGame.isOn) {
        intervalId = setInterval(startTimer, 1000);
        gGame.isOn = true;
    }

    if (cell.isShown || gGame.isGameOver) return

    const elCell = document.querySelector(`.cell-${i}-${j}`)
    if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerHTML = EMPTY
        gGame.markedCount--
        elMinesLeft.innerHTML = gLevel.MINES - gGame.markedCount
        return
    }

    if (gLevel.MINES <= gGame.markedCount) return;

    //state update
    cell.isMarked = true
    //dom update
    elCell.innerHTML = FLAG
    gGame.markedCount++
    elMinesLeft.innerHTML = gLevel.MINES - gGame.markedCount;

    checkVictory()
}

function setLevel(boardWidth, mines) {

}

function expandShown(board, elCell, i, j) {

}

function startTimer() {
    const elTimer = document.querySelector('.timer span')
    elTimer.innerHTML = gGame.secsPassed
    gGame.secsPassed++
}

function checkVictory() {
    var shownCountDown = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES // 14
    var markedCountDown = gLevel.MINES - gGame.markedCount; // 2

    if (markedCountDown !== 0) return

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isShown) {
                shownCountDown--
            }
        }
    }
    console.log(shownCountDown, markedCountDown)
    if (shownCountDown === 0 && markedCountDown === 0) {
        onGameOver();
        onVictory();
    }
}
