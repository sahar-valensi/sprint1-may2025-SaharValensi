const MINE = "💣";
const FLAG = "🚩";
const EMPTY = "";
const LIVE = "❤️";

///
var gBoard = [];
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3,
  hints: 3,
  isGameOver: false,
};

var elMinesLeft = document.querySelector(`.mines-left`);
var intervalId;
var gHintActive = false;

function onInit() {
  resetGame();
  gBoard = createBoard();
  renderBoard();

  elMinesLeft.innerHTML = gLevel.MINES;
}

function resetGame() {
  document.getElementById("winModal").style.display = "none";
  document.getElementById("loseModal").style.display = "none";
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
  };
  updateLives();
  updateHints();
  clearInterval(intervalId);
}

// function createBoard() {
//     const board = []
//     for (var i = 0; i < gLevel.SIZE; i++) {
//         board[i] = []
//         for (var j = 0; j < gLevel.SIZE; j++) {
//             var cell = {
//                 minesAroundCount: 0,
//                 isShown: false,
//                 isMine: false,
//                 isMarked: false,
//             }
//             board[i][j] = cell
//         }

//     }
//     // board[0][1].isMine = true
//     // board[2][2].isMine = true

//     placeMines(board);
//     console.table(board)
//     return board
// }

function renderBoard() {
  var strHTML = "<table><tbody>";
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < gBoard.length; j++) {
      const cell = gBoard[i][j];
      const className = `cell cell-${i}-${j}`;

      strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})"
                     oncontextmenu="onCellMarked(event, ${i}, ${j})">
          
                     </td>`;
    } //          ${cell.isMine ? MINE : setMinesNegsCount(gBoard, i, j)}   cellRightClicked
    strHTML += "</tr>";
  }
  strHTML += "</tbody></table>";

  const elContainer = document.querySelector(".game-container");
  elContainer.innerHTML = strHTML;
  // const elH2Span = document.querySelector('.h2 span')
  // elH2Span.innerHTML = gLevel.MINES
}
function updateHints() {
  const elHints = document.querySelector(".hints span");
  var hintIcons = "";
  for (var i = 0; i < gGame.hints; i++) {
    hintIcons += "🔎";
  }
  elHints.innerHTML = hintIcons;
}
function onHintClicked() {
  console.log("hint");
  if (gGame.hints > 0 && !gHintActive) {
    gHintActive = true;
  }
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

  if (size === "easy") {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
  } else if (size === "medium") {
    gLevel.SIZE = 8;
    gLevel.MINES = 10;
  } else {
    gLevel.SIZE = 12;
    gLevel.MINES = 20;
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
    console.log(`Mine${minesPlaced}: `, randomRow, randomCol);
  }
}

// //////////לסמן את הדגל עם הפונקציה,להוסיף עיצוב למספר שכנים כל אחד בצבע אחר,להגדיר את הלחיצה על הכפתור כקלאסים של חשוף ומכוסה,
function onCellClicked(elCell, i, j) {
  const cell = gBoard[i][j];
  if (gHintActive) {
    const cell = gBoard[i][j];
    if (cell.isMine) return;

    const originalContent = elCell.innerHTML;
    elCell.classList.add("hint");
    elCell.innerHTML = setMinesNegsCount(gBoard, i, j);

    setTimeout(() => {
      elCell.classList.remove("hint");
      elCell.innerHTML = originalContent;
    }, 3000);

    gGame.hints--;
    updateHints();
    gHintActive = false;
    return;
  }
  if (cell.isShown || cell.isMarked || gGame.isGameOver) return;

  if (!gGame.isOn) {
    intervalId = setInterval(startTimer, 1000);
    gGame.isOn = true;
  }

  cell.isShown = true;

  if (cell.isMine) {
    elCell.innerHTML = MINE;
    elCell.classList.add("mined");
    if (gGame.lives > 1) {
      gGame.lives--;
      updateLives();
    } else {
      gGame.lives = 0;
      updateLives();
      onGameOver();
      return;
    }
    return;
  }
  const minesCount = setMinesNegsCount(gBoard, i, j);
  elCell.innerHTML = setMinesNegsCount(gBoard, i, j);
  elCell.classList.add("x" + elCell.innerHTML.toString());
  elCell.classList.add("shown");
  if (minesCount === 0) {
    expandShown(gBoard, i, j);
  }

  checkVictory();
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
      var cell = gBoard[i][j];
      if (cell.isMine) {
        const elCell = document.querySelector(`.cell-${i}-${j}`);
        elCell.classList.add("mined");
        elCell.innerHTML = MINE;
      }
    }
  }
  //end game
  onEndGame();
  showModal("loseModal");
}

function onVictory() {
  //open modal
  showModal("winModal");

  //end game
  onEndGame();
}

function onCellMarked(event, i, j) {
  event.preventDefault();
  const cell = gBoard[i][j];

  if (!gGame.isOn) {
    intervalId = setInterval(startTimer, 1000);
    gGame.isOn = true;
  }

  if (cell.isShown || gGame.isGameOver) return;

  const elCell = document.querySelector(`.cell-${i}-${j}`);
  if (cell.isMarked) {
    cell.isMarked = false;
    elCell.innerHTML = EMPTY;
    gGame.markedCount--;
    elMinesLeft.innerHTML = gLevel.MINES - gGame.markedCount;
    return;
  }

  if (gLevel.MINES <= gGame.markedCount) return;

  //state update
  cell.isMarked = true;
  //dom update
  elCell.innerHTML = FLAG;
  gGame.markedCount++;
  elMinesLeft.innerHTML = gLevel.MINES - gGame.markedCount;

  checkVictory();
}

function setLevel(boardWidth, mines) {}
function showModal(modalId) {
  const modal = document.querySelector(`#${modalId}`);
  if (modal) {
    modal.style.display = "block";
  }
}

function expandShown(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      if (i === cellI && j === cellJ) continue
      const cell = board[i][j];
      const elNeg = document.querySelector(`.cell-${i}-${j}`)

      if (!cell.isShown && !cell.isMarked) {
        cell.isShown = true

        const minesCount = setMinesNegsCount(board, i, j)
        elNeg.innerHTML = minesCount === 0 ? "0" : minesCount
        elNeg.classList.add("shown")

        if (minesCount > 0) {
          elNeg.classList.add("x" + minesCount.toString())
        }

        if (minesCount === 0) {
          expandShown(board, elNeg, i, j)// רקורסיה
        }
      }
    }
  }
}

function startTimer() {
  const elTimer = document.querySelector(".timer span")
  elTimer.innerHTML = gGame.secsPassed
  gGame.secsPassed++
}
function updateLives() {
  const elLives = document.querySelector(".lives span")
  var hearts = ""
  for (var i = 0; i < gGame.lives; i++) {
    hearts += "❤️"
  }
  elLives.innerHTML = hearts
}
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")

  const elBtn = document.querySelector(".dark-mode-btn")
  const isDark = document.body.classList.contains("dark-mode")

  elBtn.innerText = isDark ? "Light Mode" : "Dark Mode"
}
function checkVictory() {
  var safeCellsCount = 0
  var safeShownCount = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var cell = gBoard[i][j]
      if (!cell.isMine) {
        safeCellsCount++
        if (cell.isShown) safeShownCount++
      }
    }
  }
  if (safeShownCount === safeCellsCount) {
    onVictory()
  }
}
