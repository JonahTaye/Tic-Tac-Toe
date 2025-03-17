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
        if (x < 0 || x >= row || y < 0 || y >= column) return false

        checkPos = xOboard[x][y]

        if (checkPos.value() == "") {
            checkPos.addValue(player)
            return true
        }
        else return false
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
    let roundsPlayed = 1
    let hasWon = false

    const nRound = function (row, column) {
        
        console.log(activePlayer.name())
        
        if (!hasWon && roundsPlayed < 10) {
            let tokenSet = board.add(row, column, activePlayer.token())
            hasWon = checkWinner(row, column, activePlayer)
            board.printBoard()

            if (tokenSet && !hasWon) {
                activePlayer = activePlayer.token == playerOne.token ? playerTwo : playerOne
                roundsPlayed++
            }
            

            if (roundsPlayed == 10) return "It was a tie"
            if (hasWon) {
                return `${activePlayer.name()} has won`
            }
        }
    
        
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
            const currentBoard = board.getBoard()
            const boardRow = 2
            const boardColumn = 2
            
            for(const leftRight of [1, -1]) {
                let x = row + dirX * leftRight
                let y = column + dirY * leftRight
                
                
                while(x <= boardRow && x >= 0 
                    && y <= boardColumn && y >= 0
                    && currentBoard[x][y].value() === player.token()) {
                        match++
                        x += dirX * leftRight
                        y += dirY * leftRight
                        
                        if (match == 3) return true
                }
            }
        }

        return false
    }

    return {nRound}
})()