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
                if (xOboard[i][j].value() == "") currentBoard += `   box${i}${j}:  `
                else currentBoard += `   box${i}${j}: ${xOboard[i][j].value()}`
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

    const resetBoard = function() {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                xOboard[i][j].addValue("")
            }
        }
    }

    return { create, getBoard, printBoard, add, resetBoard }
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

    const getActivePlayer = () => activePlayer.name()

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

    const resetGame = function() {
        activePlayer = playerOne
        roundsPlayed = 1
        hasWon = false
        board.resetBoard()
    }

    return {nRound, playerOne, playerTwo, getActivePlayer, resetGame}
})()

const display = (function () {
    const currentPlayer = document.querySelector(".current-player")
    const boardContainer = document.querySelector(".board-container")
    const restartBtn = document.querySelector(".restart")

    const updateScreen = function() {
        boardContainer.textContent = ""

        gameBoard = board.getBoard()

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const displayBox = document.createElement("div")
                displayBox.classList.add("box")
                displayBox.dataset.cellNumber = `${i}-${j}`
                displayBox.textContent = `${gameBoard[i][j].value()}`
                boardContainer.appendChild(displayBox)
            }
        }
    }

    const showGame = function(cell) {
        let [row, column] = cell.split("-")
        result = playGame.nRound(Number(row), Number(column))

        if (result) {
            console.log(result)
            currentPlayer.textContent = result
            score.updateScore(result)
            setTimeout(() => {
                resetDisplay()
              }, 1000);
        }
        
        updateScreen()
        playerHandler.showActivePlayer()
    }

    const resetDisplay = function() {
        currentPlayer.textContent = ""
        playGame.resetGame()
        updateScreen()
        playerHandler.showActivePlayer()
    }

    const clickFunction = function(event) {
        if (event.target.className === "box") {
            clickedCell = event.target.dataset.cellNumber
            if (!clickedCell) return
            showGame(clickedCell)
        } else if (event.target.className === "restart") {
            resetDisplay()
            score.resetScore()
        }
    }

    updateScreen()
    boardContainer.addEventListener("click", clickFunction)
    restartBtn.addEventListener("click", clickFunction)
})()

const playerHandler = (function () {
    const firstPlayer = document.querySelector(".player-one")
    const secondPlayer = document.querySelector(".player-two")
    const playerOneName = firstPlayer.querySelector(".name")
    const playerTwoName = secondPlayer.querySelector(".name")
    const dialogBox = document.querySelector("dialog")
    const form = document.querySelector("form")

    let playerOne = playGame.playerOne
    let playerTwo = playGame.playerTwo

    const setPlayer = function() {
        playerOneName.textContent = playerOne.name()
        playerTwoName.textContent = playerTwo.name()
    }

    const currentPlayer = (function() {
        let currentPlayerName = "name"
        const setName = function(name) {
            currentPlayerName = name
            console.log(currentPlayerName)
        }
        const getName = () => currentPlayerName

        return { setName, getName}
    })()

    const changeName = function(newName) {
        console.log(currentPlayer.getName())
        if(playerOne.name() === currentPlayer.getName()) {
            playerOne.addPlayer(newName, "X")
        } else playerTwo.addPlayer(newName, "O")

        setPlayer()
    }

    const showActivePlayer = function() {
        let playerOneName = firstPlayer.querySelector(".name").textContent
        let playerTwoName = secondPlayer.querySelector(".name").textContent

        const playerOneBackground = firstPlayer.querySelector(".player-container")
        const playerTwoBackground = secondPlayer.querySelector(".player-container")
        if(playerOneName === playGame.getActivePlayer()) {  
            playerOneBackground.style.backgroundColor = "green"
            playerTwoBackground.style.backgroundColor = ""
        } else if(playerTwoName === playGame.getActivePlayer()) {
            playerTwoBackground.style.backgroundColor = "green"
            playerOneBackground.style.backgroundColor = ""
        }
    }

    const submitForm = function() {
        let name = form.querySelector("#name").value
        changeName(name)
    }

    const clickFunction = function(event) {
        if (event.target.closest(".player-container")) {
            dialogBox.showModal()
            let player = event.target.closest(".player-container")
            
            let input = dialogBox.querySelector("#name")
            input.value = player.querySelector(".name").textContent
            
            currentPlayer.setName(input.value)
        }
    }
    
    setPlayer()
    showActivePlayer()
    firstPlayer.addEventListener("click", clickFunction)
    secondPlayer.addEventListener("click", clickFunction)
    form.addEventListener("submit", submitForm)

    return {showActivePlayer}
})()

const score = (function() {
    const firstPlayer = document.querySelector(".player-one")
    const secondPlayer = document.querySelector(".player-two")

    let firstPlayerScore = 0
    let secondPlayerScore = 0
    const updateScore = function(gameResult) {
        if(gameResult.includes(playGame.playerOne.name())) {
            firstPlayerScore ++
            let scoreCard = firstPlayer.querySelector(".wins")
            scoreCard.textContent = firstPlayerScore
        } else if(gameResult.includes(playGame.playerTwo.name())) {
            secondPlayerScore ++
            let scoreCard = secondPlayer.querySelector(".wins")
            scoreCard.textContent = secondPlayerScore
        }
    }

    const resetScore = function() {
        firstPlayerScore = 0
        secondPlayerScore = 0
        firstPlayer.querySelector(".wins").textContent = 0
        secondPlayer.querySelector(".wins").textContent = 0
    }


    return {updateScore, resetScore}
})()