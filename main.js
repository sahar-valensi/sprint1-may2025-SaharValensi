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
    secsPassed: 0
}
// creatBoard()
function onInit() {
    gBoard = creatBoard()
    renderBoard()
    setInterval(startTimer, 1000)
}
function creatBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true,
            }
            board[i][j] = cell
        }

    }
    board[0][1].isMine = true
    board[2][2].isMine = true

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
    if (count === 0) {
        expandShown()
    }
    // const elCell = document.querySelector(`.cell-${i}-${j}`)
    // elCell.classList.add('x${count}')
    return count;
}
function placeMines(board) {
    var minesPlaced = 0;
    while (minesPlaced < gLevel.MINES) {
        var randomRow = getRandomInt(0, gLevel.SIZE);
        var randomCol = getRandomInt(0, gLevel.SIZE);

        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true;
            minesPlaced++;
        }
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
    // if (cell.isMarked) return
    if (cell.isShown) return
    if (!cell.isShown) {
        cell.isShown = true
        elCell.innerHTML = setMinesNegsCount(gBoard, i, j)
        elCell.classList.add('x' + elCell.innerHTML.toString())
        elCell.classList.add("marked")
    }
    if (cell.isMine) {
        elCell.innerHTML = MINE
        showAllMines()
        // checkGameOver()
    }
    // var BOMB =  cell.isMine ? MINE : setMinesNegsCount(gBoard, i, j)
    console.log(elCell)
    // placeMines(board)
    startTimer()
}
function showAllMines() {
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
}

function onCellMarked(event, i, j) {
    event.preventDefault()
    const cell = gBoard[i][j]
    if (cell.isShown) return
    console.log('flag')

    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = FLAG
    cell.isMarked = true

    // if (cell.isMarked) {
    //     elCell.innerHTML = ''
    //     cell.isMarked = false
    // }
}
function setLevel(boardWidth, mines) {

}
function expandShown(board, elCell, CellI, CellJ) {
    for (var i = CellI - 1; i <= CellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = CellJ - 1; j <= CellJ + 1; j++) {
            if (i === CellI && j === CellJ) continue
            if (j < 0 || j >= gLevel.SIZE) continue

            var currCell = board[i][j]
            if (currCell.isShown) continue
            countShown++

            currCell.isShown = true;
            const elNeighbor = document.querySelector(`.cell-${i}-${j}`);
            elNeighbor.classList.add("marked")

            const mineCount = setMinesNegsCount(board, i, j)
            elNeighbor.innerHTML = mineCount === 0 ? '' : mineCount

            if (mineCount === 0) {
                expandShown(board, elNeighbor, i, j);
            }
        }
    }
}
function startTimer() {
    var time = gGame.secsPassed
    time++
    const elTimer = document.querySelector('.timer span')
    elTimer.innerHTML = time

}
function checkGameOver() {

}
