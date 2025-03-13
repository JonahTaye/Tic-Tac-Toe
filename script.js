const board = (function () {
    const row = 3
    const column = 3
    const xOboard = []
    const create = function () {
        for (let i = 0; i < row; i++) {
            xOboard[i] = []
            for (let j = 0; j < column; j++) {
                xOboard[i].push(box())

            }
        }
    }

    const getBoard = () => xOboard

    const printBoard = function() {
        let currentBoard = ""
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                currentBoard += `   col${i}${j}: ${xOboard[i][j].value()}`
            }
            currentBoard += "\n"
        }

        console.log(currentBoard)
    }

    const add = function (x, y, player) {
        if (x <= row && row <= x && y <= column && column <= y) return

        checkPos = xOboard[x][y]

        if (checkPos.value() == "") checkPos.addValue(player)
        else return
    }

    return { create, getBoard, printBoard, add }
})()

const box = function () {
    let boxValue = ""

    const addValue = function (player) {
        boxValue = player
    }

    const value = () => boxValue

    return { addValue, value }
}

const player = function () {
    let playerName = ""
    let playerToken = ""

    const addPlayer = function (name, token) {
        playerName = name
        playerToken = token
    }

    const token = () => playerToken

    const name = () => playerName

    return { addPlayer, token, name }
}

const playGame = (function () {
    board.create()
    const playerOne = player()
    const playerTwo = player()

    playerOne.addPlayer("Player-One", "X")
    playerTwo.addPlayer("Player-Two", "O")

    let activePlayer = playerOne

    const nRound = function (row, column) {
        
        console.log(playerOne.name())
        
        let roundsPlayed = 1
        let hasWon = true

        if (hasWon) {
            board.add(row, column, activePlayer.token())
            hasWon = checkWinner(row, column, activePlayer)
            activePlayer = activePlayer.token == playerOne.token ? playerTwo : playerOne
            roundsPlayed++
            board.printBoard()
            
            if (roundsPlayed > 10) return "It was a tie"
        }

        if (hasWon) return `${activePlayer.name()} has won`
    }

    const checkWinner = function (row, column, player) {
        const directions = [
            [0, 1], //horizontal
            [1, 0], //vertical
            [1, 1], //diagonal right
            [1, -1] //diagonal left
        ]

        for (const [dirX, dirY] of directions) {
            let match = 1
            
            for(const leftRight of [1, -1]) {
                let x = row + dirX * leftRight
                let y = column + dirY * leftRight

                while(x <= row && row <= x 
                    && y <= column && column <= y 
                    && board[x][y].value() == player.token()) {
                        match++
                        x += dirx * leftRight
                        y += dirY * leftRight

                        if (match == 2) return true
                }
            }
        }

        return false
    }

    return {nRound}
})()