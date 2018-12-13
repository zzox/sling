const express = require('express')
const app = express()

const Game = require('./game/game')

let gameInputs = {}
let gamesArray = []

let updates = 0

let intervalSet = false

let lastTime = Date.now()

const server = require('http').createServer();
const io = require('socket.io')(server, {
  serveClient: false,
  wsEngine: 'ws' // uws is not supported since it is a native module
});
const port = process.env.PORT || 5000;

io.on('connect', function(socket){
	console.log(socket.id)

	let newGameId = createGameId()

	let newGame = new Game({
		gameId: newGameId,
		getInput
	})

	gameInputs[newGameId] = {
		player1: {
			jump: false,
			dash: false
		},
		player2: {
			jump: false,
			dash: false
		}
	}

	gamesArray.push(newGame)

	if (!intervalSet){
		setInterval(() => {
			updateGames(socket)
		}, 1000 / 60)

		intervalSet = true
	}

	socket.emit('gameId', newGameId)

	socket.on('gameInput', data => {
		let gameId = data.gameId
		if(gameInputs[gameId]) {
			gameInputs[gameId].player1 = data.player1
			gameInputs[gameId].player2 = data.player2
		}
	})

	socket.on('disconnect', () => console.log('disconnect ' + socket.id))
})

const letters = 'bcdfghjklmnpqrstvwxz1234567890'

function createGameId () {
	let l = letters.split('')
	let gameId = ''
	for (let i = 0; i < 4; i++) {
		let j = Math.floor(Math.random() * l.length)
		gameId += l[j]
	}
	console.log(gameId)
	return gameId
}

function updateGames(socket) {
	let time = Date.now()
	let delta = time - lastTime
	for (let i = 0; i < gamesArray.length; i++) {
		gamesArray[i].update(delta)

		socket.emit('gameState', gamesArray[i].getState())
	}

	lastTime = time

	if(updates % 60 === 0 && updates !== 0) console.log(updates / 60)
}

function getInput(gameId) {
	return gameInputs[gameId]
}


server.listen(port, () => console.log('server listening on port ' + port))
