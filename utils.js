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











function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}