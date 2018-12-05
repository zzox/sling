const ground = 94
const ceiling = 23

const playerWidth = 14
const playerHeight = 12

const gravity = 200
const jumpVel = 200
const maxYVel = 250
const dashVel = 500

const jumpTimer = 135

class Game {
	constructor({ gameId, getInput }) {
		this.gameId = gameId
		this.getInput = getInput

		this.initState()

		this.numGames = 0

		this.score = {
			player1: 0,
			player2: 0
		}
	}

	initState () {
		this.player1 = {
			innerState: {
				yVel: 0,
				jumpTime: 0,
				jumps: 0,
				maxJumps: 2,
				jumping: false
			}, 
			state: {
        x: 10,
        y: 94,
        inAir: false,
        dashing: false,
        lost: false,
        won: false
			}
		}

		this.player2 = {
			innerState: {
				yVel: 0,
				jumpTime: 0,
				jumps: 0,
				maxJumps: 2,
				jumping: false
			},
			state: {
        x: 168,
        y: 94,
        inAir: false,
        dashing: false,
        lost: false,
        won: false
			}
		}

		this.prevInput = {
			player1: {
				jump: true,
				dash: true
			},
			player2: {
				jump: true,
				dash: true
			}
		}

		this.scoreTo = 7

		this.over = false
		this.started = false
		this.display = ''

		this.gameTime = 0
		this.countDownTime = 0
		this.countDownTimer = 3000
		this.gameOverTime = 0
		this.gameOverTimer = 3000

		this.jumpTimer = 100

		this.slowMoTime = 0
		this.slowMoTimer = 100
		// slow mo for now
		this.step = 0
	}

	update (delta) {

		// delta = 17
		// console.log(delta)

		// timers
		if (this.over) {
			if(this.gameOverTime > this.gameOverTimer){
				this.initState()
			}

			this.gameOverTime += delta
		}

		if (!this.started) {
			if (this.countDownTime > this.countDownTimer) {
				this.started = true
				this.display = 'go'
			}

			if (this.countDownTime > 0 && this.countDownTime <= 1000) {
				this.display = 'count3'
			} else if (this.countDownTime > 1000 && this.countDownTime <= 2000) {
				this.display = 'count2'
			} else if (this.countDownTime > 2000 && this.countDownTime <= 3000) {
				this.display = 'count1'
			}

			this.countDownTime += delta
		}

		if (this.started && !this.over) {
			if (this.gameTime < 1000) {
				this.display = 'go'
			} else {
				if(this.display === 'go') {
					this.display = ''
				}
			}

			this.gameTime += delta
		}

		if (this.over || (this.player1.state.dashing && this.player2.state.dashing)) {
			delta = delta / 3
		}

		let perSec = delta / 1000
		let input = this.getInput(this.gameId)

		// if(perSec > 5) return

		// kick off here for slo-mo

		if (input.player1.jump) {
			this.player1.innerState.jumpTime += delta
		} else {
			this.player1.innerState.jumpTime = 0
			this.player1.innerState.jumping = false
		}

		if (input.player2.jump) {
			this.player2.innerState.jumpTime += delta
		} else {
			this.player2.innerState.jumpTime = 0
			this.player2.innerState.jumping = false
		}

		// test
		// if(this.colliding) return

			if (!this.player1.state.dashing) {
				// change to "is and can be jumping"
				if (((input.player1.jump && !this.prevInput.player1.jump) && 
						(this.player1.innerState.jumps < this.player1.innerState.maxJumps)) ||
						
					(input.player1.jump && this.player1.innerState.jumping &&
						this.player1.innerState.jumpTime < jumpTimer &&
						this.player1.innerState.jumps <= this.player1.innerState.maxJumps)) {
							this.player1.innerState.yVel = -jumpVel * perSec
							this.player1.state.inAir = true
							this.player1.innerState.jumping = true
							if (input.player1.jump && !this.prevInput.player1.jump) {
								this.player1.innerState.jumps++
							}
				} else {
					// 																									// why does this work? (1 / 8)
					this.player1.innerState.yVel += (gravity * perSec * 1 / 8)
				}

				if(this.player1.innerState.yVel > maxYVel * perSec) {
					this.player1.innerState.yVel = maxYVel * perSec
				}

				if(this.player1.innerState.yVel < -maxYVel * perSec) {
					this.player1.innerState.yVel = -maxYVel * perSec
				} 

				this.player1.state.y += this.player1.innerState.yVel

				if (this.player1.state.y >= ground) {
					this.player1.state.y = ground
					this.player1.innerState.yVel = 0
					this.player1.state.inAir = false
					this.player1.innerState.jumps = 0
				} else if (this.player1.state.y < ceiling) {
					this.player1.state.y = ceiling
					this.player1.innerState.yVel = 0
				}

				if (input.player1.dash && this.started) {
					this.player1.state.dashing = true
				}
			} else {
				this.player1.state.x += dashVel * perSec
				// console.log(dashVel * perSec)
			}

			if (!this.player2.state.dashing) {
				if (((input.player2.jump && !this.prevInput.player2.jump) && 
						(this.player2.innerState.jumps < this.player2.innerState.maxJumps)) ||
						
					(input.player2.jump && this.player2.innerState.jumping &&
						this.player2.innerState.jumpTime < jumpTimer &&
						this.player2.innerState.jumps <= this.player2.innerState.maxJumps)) {
							this.player2.innerState.yVel = -jumpVel * perSec
							this.player2.state.inAir = true
							this.player2.innerState.jumping = true
							if (input.player2.jump && !this.prevInput.player2.jump) {
								this.player2.innerState.jumps++
							}
				} else {
					this.player2.innerState.yVel += (gravity * perSec * 1 / 8)
				}

				if(this.player2.innerState.yVel > maxYVel * perSec) {
					this.player2.innerState.yVel = maxYVel * perSec
				}

				if(this.player2.innerState.yVel < -maxYVel * perSec) {
					this.player2.innerState.yVel = -maxYVel * perSec
				} 

				this.player2.state.y += this.player2.innerState.yVel

				if (this.player2.state.y >= ground) {
					this.player2.state.y = ground
					this.player2.innerState.yVel = 0
					this.player2.state.inAir = false
					this.player2.innerState.jumps = 0
				} else if (this.player2.state.y < ceiling) {
					this.player2.state.y = ceiling
					this.player2.innerState.yVel = 0
				}

				if (input.player2.dash && this.started) {
					this.player2.state.dashing = true
				}
			} else {
				this.player2.state.x += -dashVel * perSec
			}

		if(this.player1.state.dashing || this.player2.state.dashing) {
			if (Math.abs(this.player1.state.x - this.player2.state.x) < 20) {
				console.log('close')
				if (this.player1.state.x < this.player2.state.x + playerWidth && 
					this.player1.state.x + playerWidth > this.player2.state.x &&
				  this.player1.state.y < this.player2.state.y + playerWidth && 
				  this.player1.state.y + playerWidth > this.player2.state.y) {

					if (!this.over) {
						this.collideLogic()
						this.over = true
					}
					console.log('colliding!!!!!')
					
					this.colliding = true
				} else {
					this.colliding = false // remove
				}
			} else {
				this.colliding = false // remove
			}
		}

		if (this.player1.state.x > 180 && !this.player2.state.dashing && !this.over) {
			this.over = true
			this.display = 'two'
			this.score.player2 += 1
		}

		if (this.player2.state.x < 0 && !this.player1.state.dashing && !this.over) {
			this.over = true
			this.display = 'one'
			this.score.player1 += 1
		}

		if(this.player2.state.x < 0 && this.player1.state.x > 180 && !this.over) {
			this.over = true
			this.display = 'draw'
		}

		this.prevInput = {
			player1: {
				jump: input.player1.jump,
				dash: input.player1.dash
			},
			player2: {
				jump: input.player2.jump,
				dash: input.player2.dash
			}
		}
	}

	getState () {
		return {
			over: this.over,
			display: this.display,
			colliding: this.colliding,
			score: this.score,
			player1: {
				state: this.player1.state
			},
			player2: {
				state: this.player2.state
			}
		}
	}

	collideLogic () {
		if (this.player1.state.dashing && !this.player2.state.dashing) {
			this.player1.state.won = true
			this.player2.state.lost = true
			this.display = 'onehit'
			this.score.player1 += 3
			return
		} 

		if (!this.player1.state.dashing && this.player2.state.dashing) {
			this.player1.state.lost = true
			this.player2.state.won = true
			this.display = 'twohit'
			this.score.player2 += 3
			return
		}

		if (this.player1.state.dashing && this.player2.state.dashing) {
			let p1y = Math.round(this.player1.state.y)
			let p2y = Math.round(this.player2.state.y)

			if (p1y < p2y) {
				this.player1.state.won = true
				this.player2.state.lost = true
				this.display = 'onehit'
				this.score.player1 += 3
				return
			}

			if (p2y < p1y) {
				this.player1.state.lost = true
				this.player2.state.won = true
				this.display = 'twohit'
				this.score.player2 += 3
				return
			}

			if (p1y === p2y) {
				this.display = 'tie'
				return
			}
		}
	}
}




updateGame = (data) => {
	if(data){
		for (let player in data) {
			let p = data[player]

		}

		return data
	} 
}

// updateInput = (data) => {
// 	console.log(data)
// }


module.exports = Game
