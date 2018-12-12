const ground = 94
const ceiling = 23

const playerWidth = 14
// maybe 10 or 11
const playerHeight = 12

const gravity = 200
const jumpVel = 200
const maxYVel = 250

const redirVel = 600

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

    this.matchOver = false
    this.scoreTo = 7
    this.matchWinner = null
  }

  initState () {
    this.player1 = {
      innerState: {
        xVel: 0,
        yVel: 0,
        dashVel: 500,
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
        won: false,
        powerUps: []
      }
    }

    this.player2 = {
      innerState: {
        xVel: 0,
        yVel: 0,
        dashVel: 500,
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
        won: false,
        powerUps: []
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

    this.over = false
    this.started = false
    this.display = ''

    this.gameTime = 0
    this.countDownTime = 0
    this.countDownTimer = 3000
    this.gameOverTime = 0
    this.gameOverTimer = 2000

    this.jumpTimer = 100

    this.slowMo = false

    this.powerUpTime = 0
    this.powerUpTimer = 6000
    this.powerUpRandom1 = 0
    this.powerUp1Added = false
    this.powerUpRandom2 = 0
    this.powerUp2Added = false
    this.powerUpFire = 0
    this.powerUpAdded = false
    this.powerUpsAdded = false

    this.powerUps = []
    this.powerUpsScr = []
  }

  update (delta) {
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

    this.powerUpTime += delta



    if(this.powerUpTime >= this.powerUpTimer && !this.powerUpsAdded) {
      
      this.powerUpRandom1 = Math.random() * 3000 + 6000
      this.powerUpRandom2 = Math.random() * 8000 + 11000
      this.powerUpFire = Math.random() * 15000 + 15000

      this.powerUpsAdded = true
    }

    if (this.powerUpsAdded && this.powerUpTime > this.powerUpRandom1 && !this.powerUp1Added) {
      let r = Math.random()
      let h = Math.random()
      let p

      if (r < 0.4) {
        p = 'threeJumps'
        this.powerUps.push('threeJumps')
        this.powerUps.push('fourJumps')
      } else if (r < .75) {
        p = 'fourJumps'
        this.powerUps.push('threeJumps')
        this.powerUps.push('fourJumps')
      } else if (r < 0.9) {
        p = 'fast'
        this.powerUps.push('fast')
        this.powerUps.push('faster')
      } else {
        p = 'faster'
        this.powerUps.push('fast')
        this.powerUps.push('faster')
      }

      console.log(p)

      this.powerUpsScr.push({ name: p, x: 12, y: h * 35 + 23 })
      this.powerUpsScr.push({ name: p, x: 168, y: h * 35 + 23 })

      this.powerUp1Added = true
    }


    if (this.powerUpsAdded && this.powerUpTime > this.powerUpRandom2 && !this.powerUp2Added) {
      let r = Math.random()
      let h = Math.random()
      let p

      if (this.powerUps.includes('threeJumps')) {
        if (r < .6) {
          p = 'fast'
        } else {
          p = 'faster'
        }
      } else {
        if (r < .6) {
          p = 'threeJumps'
        } else {
          p = 'fourJumps'
        }
      }

      console.log(p)

      this.powerUpsScr.push({ name: p, x: 12, y: h * 35 + 25 })
      this.powerUpsScr.push({ name: p, x: 168, y: h * 35 + 25 })

      this.powerUp2Added = true
    }

    let i = 0
    let max = this.powerUpsScr.length
    for (; i < max; i++) {
      let p = this.powerUpsScr[i]
      if (Math.abs(this.powerUpsScr[i].x - this.player1.state.x) < 4 &&
        Math.abs(this.powerUpsScr[i].y - this.player1.state.y) < 4) {
        this.player1.state.powerUps.push(p.name)
        this.addPowerUp(1, p.name)
        this.powerUpsScr.splice(i, 1)
        max -= 1
        continue
      }

      if (Math.abs(this.powerUpsScr[i].x - this.player2.state.x) < 4 &&
        Math.abs(this.powerUpsScr[i].y - this.player2.state.y) < 4) {
        this.player2.state.powerUps.push(p.name)
        this.addPowerUp(2, p.name)
        this.powerUpsScr.splice(i, 1)
        max -= 1
      }
    }

    if (this.over || (this.player1.state.dashing && this.player2.state.dashing)) {
      delta = delta / 3
      this.slowMo = true
    }

    let perSec = delta / 1000
    let input = this.getInput(this.gameId)

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
        //                                                  // why does this work? (1 / 8)
        this.player1.innerState.yVel += (gravity * perSec * 1 / 8)
      }

      if(this.player1.innerState.yVel > maxYVel * perSec) {
        this.player1.innerState.yVel = maxYVel * perSec
      } else if (this.player1.innerState.yVel < -maxYVel * perSec) {
        this.player1.innerState.yVel = -maxYVel * perSec
      }

      if (input.player1.dash && !this.prevInput.player1.dash && this.started) {
        this.player1.state.dashing = true
      }
    } else {
      if(!this.over) {
        this.player1.innerState.xVel = this.player1.innerState.dashVel * perSec
        this.player1.innerState.yVel = 0
      }
      // console.log(this.player1.innerState.dashVel * perSec)
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
      } else if (this.player2.innerState.yVel < -maxYVel * perSec) {
        this.player2.innerState.yVel = -maxYVel * perSec
      } 

      if (input.player2.dash && this.started) {
        this.player2.state.dashing = true
      }
    } else {
      if(!this.over) {
        this.player2.innerState.xVel = -this.player2.innerState.dashVel * perSec
        this.player2.innerState.yVel = 0
      }
    }

    if(this.player1.state.dashing || this.player2.state.dashing) {
      if (Math.abs(this.player1.state.x - this.player2.state.x) < 20) {
        if (this.player1.state.x < this.player2.state.x + playerWidth && 
          this.player1.state.x + playerWidth > this.player2.state.x &&
          this.player1.state.y < this.player2.state.y + playerHeight && 
          this.player1.state.y + playerHeight > this.player2.state.y) {

          if (!this.over) {
            this.collideLogic(perSec)
          }
          
          this.colliding = true
        } else {
          this.colliding = false // remove
        }
      } else {
        this.colliding = false // remove
      }
    }

    if (this.player2.state.x < 0 && !this.player1.state.dashing && !this.over) {
      this.decideOver(1, 1)
    }

    if (this.player1.state.x > 180 && !this.player2.state.dashing && !this.over) {
      this.decideOver(2, 1)
    }

    if(this.player2.state.x < 0 && this.player1.state.x > 180 && !this.over) {
      this.display = 'tie'
      this.over = true
    }

    this.player1.state.x += this.player1.innerState.xVel
    this.player1.state.y += this.player1.innerState.yVel
    if (this.player1.state.y >= ground && !this.player1.state.lost) {
      this.player1.state.y = ground
      this.player1.innerState.yVel = 0
      this.player1.state.inAir = false
      this.player1.innerState.jumps = 0
    } else if (this.player1.state.y < ceiling && !this.player1.state.lost) {
      this.player1.state.y = ceiling
      this.player1.innerState.yVel = 0
    }

    this.player2.state.x += this.player2.innerState.xVel
    this.player2.state.y += this.player2.innerState.yVel
    if (this.player2.state.y >= ground && !this.player2.state.lost) {
      this.player2.state.y = ground
      this.player2.innerState.yVel = 0
      this.player2.state.inAir = false
      this.player2.innerState.jumps = 0
    } else if (this.player2.state.y < ceiling && !this.player1.state.lost) {
      this.player2.state.y = ceiling
      this.player2.innerState.yVel = 0
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
      powerUpsScr: this.powerUpsScr,
      player1: {
        state: this.player1.state
      },
      player2: {
        state: this.player2.state
      }
    }
  }

  collideLogic (perSec) {
    let p1y = Math.floor(this.player1.state.y)
    let p2y = Math.floor(this.player2.state.y)
    let ratio = (p1y - p2y) / playerHeight

    if (this.player1.state.dashing && !this.player2.state.dashing) {
      this.decideOver(1, 3, ratio, perSec)
      return
    } 

    if (!this.player1.state.dashing && this.player2.state.dashing) {
      this.decideOver(2, 3, ratio, perSec)
      return
    }

    if (this.player1.state.dashing && this.player2.state.dashing) {
      if (p1y < p2y) {
        this.decideOver(1, 3, ratio, perSec)
        return
      }

      if (p2y < p1y) {
        this.decideOver(2, 3, ratio, perSec)
        return
      }

      if (p1y === p2y) {
        this.decideOver(0, 3, ratio, perSec)
        return
      }
    }
  }

  decideOver (winner, points, ratio, perSec) {
    switch (winner) {
      case (0):
        this.display = 'tie'
        this.player1.innerState.xVel = -this.player1.innerState.xVel
        this.player2.innerState.xVel = -this.player2.innerState.xVel
        break
      case (1):
        this.player1.state.won = true
        this.player2.state.lost = true
        if(points === 1) {
          this.display = 'one'
        } else if(points === 3) {
          this.display = 'onehit'
          this.redirect(2, ratio, perSec)
        }
        this.score.player1 += points
        break
      case (2):
        this.player1.state.lost = true
        this.player2.state.won = true
        if(points === 1) {
          this.display = 'two'
        } else if(points === 3) {
          this.display = 'twohit'
          this.redirect(1, ratio, perSec)
        }
        this.score.player2 += points
        break
    }

    this.checkMatchOver()
    this.over = true
  }

  checkMatchOver () {
    // if(this.player1.score)
  }

  redirect (loser, ratio, perSec) {
    if (loser === 1) {
      if (ratio > 0) {
        // player 2 higher
        console.log('player 2 higher')
        console.log(ratio)
        this.player1.innerState.xVel = -redirVel * (1 - ratio) * perSec
        this.player1.innerState.yVel = redirVel * ratio * perSec          
      } else {
        console.log('player 2 lower')
        console.log(ratio)
        this.player1.innerState.xVel = -redirVel * (1 + ratio) * perSec
        this.player1.innerState.yVel = redirVel * ratio * perSec    
      }
    } else if(loser === 2) {
      if (ratio < 0) {
        console.log('player 1 higher')
        console.log(ratio)
        this.player2.innerState.xVel = redirVel * (1 + ratio) * perSec
        this.player2.innerState.yVel = redirVel * -ratio * perSec          
      } else {
        console.log('player 1 lower')
        console.log(ratio)
        this.player2.innerState.xVel = redirVel * (1 - ratio) * perSec
        this.player2.innerState.yVel = -redirVel * ratio * perSec    
      }       
    }
  }
  
  addPowerUp (player, powerUp) {
    // console.log(player)
    // console.log(powerUp)
    switch (powerUp) {
      case ('threeJumps'):
        if (player === 1) {
          this.player1.innerState.maxJumps = 3
        } else {
          this.player2.innerState.maxJumps = 3
        }
        break
      case ('fourJumps'):
        if (player === 1) {
          this.player1.innerState.maxJumps = 4
        } else {
          this.player2.innerState.maxJumps = 4
        }
        break
      case ('fast'):
        if (player === 1) {
          this.player1.innerState.dashVel = 750
        } else {
          this.player2.innerState.dashVel = 750
        }
        break
      case ('faster'):
        if (player === 1) {
          this.player1.innerState.dashVel = 1000
        } else {
          this.player2.innerState.dashVel = 1000
        }
        break
    }

    if (player === 1) {
      this.player1.state.powerUps.push(powerUp)
    } else {
      this.player2.state.powerUps.push(powerUp)
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
//  console.log(data)
// }


module.exports = Game
