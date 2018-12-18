import io from 'socket.io-client'
import Player from '../Player/Player'
import AI from '../Player/AI'
import HUD from '../Objects/HUD'
import game from '../game/game'

export default class GameScene extends Phaser.Scene {
  constructor (config) {
    super({
      key: 'GameScene'
    })

    this.gameId = ''
  }

  preload () {
    this.local = this.sys.settings.data.local

    if (!this.local) {
      this.stage = this.sys.settings.data.stage
      this.stageConfig = this.sys.cache.json.entries.entries.stages[this.stage]

      this.ai = this.stageConfig.ai
      this.matchTo = this.stageConfig.matchTo
    } else {
      this.matchTo = 11
    }
    this.gameObj = new game(this, this.matchTo)

    this.player1Color = 'green'
    if (this.local) {
      this.player2Color = 'pink'
    } else {
      this.player2Color = this.stageConfig.ai.color
    }

    // change to dynamic loading colors
    this.load.image(`${this.player1Color}-particle`, `assets/particles/${this.player1Color}Particle.png`)
    this.load.image(`${this.player2Color}-particle`, `assets/particles/${this.player2Color}Particle.png`)
    this.load.image('white-particle', 'assets/particles/whiteParticle.png')
    this.load.image('gold-particle', 'assets/particles/goldParticle.png')
    this.load.image('purple-particle', 'assets/particles/purpleParticle.png')

    this.load.image(`${this.player1Color}Point`, `assets/points/${this.player1Color}Point.png`)
    this.load.image(`${this.player2Color}Point`, `assets/points/${this.player2Color}Point.png`)

    this.load.image('fast', 'assets/powerups/fast.png')
    this.load.image('faster', 'assets/powerups/faster.png')
    this.load.image('threeJumps', 'assets/powerups/threeJumps.png')
    this.load.image('fourJumps', 'assets/powerups/fourJumps.png')
    this.load.image('fire', 'assets/powerups/fire.png')

    this.load.image('background', `assets/backgrounds/background.png`)
    this.load.image('sling-tile', `assets/tilesets/sling-tile.png`)

    this.animsConfig = this.sys.cache.json.entries.entries.animations

    this.load.spritesheet(`${this.player1Color}Player`, `assets/players/${this.player1Color}Player.png`, { frameWidth: 14, frameHeight: 14, spacing: 2, margin: 1 })
    this.load.spritesheet(`${this.player2Color}Player`, `assets/players/${this.player2Color}Player.png`, { frameWidth: 14, frameHeight: 14, spacing: 2, margin: 1 })
    // this.load.spritesheet(`slingTile1`, `assets/tilesets/slingTile1.png`, { frameWidth: 12, frameHeight: 12, spacing: 2, margin: 1 })
    // this.load.tilemapTiledJSON(this.stage, `assets/tilemaps/${this.stage}.json`)
  }

  create () {
    // this.add.bitmapText(20, 20, 'font', 'start coding!')
    this.animsArray = [`${this.player1Color}Player`, `${this.player2Color}Player`]
    this.createAnimations()

    this.add.image(96, 72, 'background')
      .setAlpha(0.45)

    this.add.image(18, 114, 'sling-tile')
    this.add.image(174, 114, 'sling-tile')

    // this.map = this.make.tilemap({
    //   key: this.stage
    // })
    if (this.local) {
      let r = Math.floor(Math.random() * 5)
      this.cameras.main
        .setBackgroundColor(`#${this.colors()[r]}`)
    } else {
      let color = this.stageConfig.backgroundColor

      this.cameras.main
        .setBackgroundColor(`#${color}`)
    }

    // this.contactTileSet = this.map.addTilesetImage('slingTile1', `slingTile1`)
    // this.contactLayer = this.map.createDynamicLayer('contactLayer', this.contactTileSet, 0, 0)

    // this.add.graphics({ fillStyle: { color: 0x000000 } })
    //   .fillRectShape(new Phaser.Geom.Rectangle(0, 0, 192, 12))
    //   .setScrollFactor(0, 0)

    // this.display = this.add.bitmapText(40, 40, 'font', '')
    // this.player1score = this.add.bitmapText(2, 2, 'font', '0')
    // this.player2score = this.add.bitmapText(184, 2, 'font', '0')

    this.HUD = new HUD(this)
    // this.HUD.create()

    if (this.local) {
      this.keys = {
        oneJump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        oneDash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        twoJump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        twoDash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
      }
    } else {
      this.keys = {
        oneJump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        oneDash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
      }
    }

    this.player1 = new Player(this, 1, this.player1Color)
    if(this.local){
      this.player2 = new Player(this, 2, this.player2Color)
    } else {
      this.player2 = new AI(this, 2, this.stageConfig.ai)
    }

    this.player1.create()
    this.player2.create()

    this.gameState = {
      powerUpsScr: [],
      player1: {
        x: 29,
        y: 149,
        inAir: false,
        dashing: false,
        lost: false,
        won: false,
        powerUps: []
      },
      player2: {
        x: 211,
        y: 149,
        inAir: false,
        dashing: false,
        lost: false,
        won: false,
        powerUps: []
      },
      score: {
        player1: 0,
        player2: 0
      }
    }

    this.prevState = {
      over: false,
      powerUpsScrLen: 0
    }

    this.powerUpsOnScreen = []
    this.powerUps = this.add.group()

    if (!this.local) {
      this.aiState = 'idle'
      this.decisionTimer = this.ai.decisionTime
      this.decisionTime = 0
    }

    this.newGame()
  }

  newGame () {
    this.cameras.main
      .fadeIn(500)

    this.powerUps.clear(true, true)

    this.gameOverTimer = 1000
    this.gameOverTime = 0
    this.gameOver = false
    this.fading = false
  }

  update (t, delta) {

    let input

    if (this.local) {
      input = {
        player1: {
          jump: this.keys.oneJump.isDown,
          dash: this.keys.oneDash.isDown
        },
        player2: {
          jump: this.keys.twoJump.isDown,
          dash: this.keys.twoDash.isDown
        }
      }
    } else {
      let jump = false 
      let dash = false

      let player1 = this.gameState.player1.state
      let player2 = this.gameState.player2.state

      if (!this.over) {
        if (this.decisionTime > this.decisionTimer) {

          let abs = Math.abs(player1.y - player2.y)
          let r = Math.random()

          if ((player1.y < player2.y || abs > 24) && r < this.ai.randomSmarts * 3) {
            this.aiState = 'jump'
          } else if (player1.y > player2.y && Math.abs(player1.y - player2.y) < 24 && r < this.ai.randomSmarts){
            this.aiState = 'dash'
          } else if (player1.y === player2.y && r < (this.ai.randomSmarts / 3)) {
            this.aiState = 'dashJump'
          // } else if (r < 1 - this.ai.randomSmarts * 3){
          //   this.aiState = 'dash'
          //   console.log('this dash')
          } else {
            this.aiState = 'idle'
          }

          this.decisionTime = 0
        } else {
          this.decisionTime += delta
        }

        switch (this.aiState) {
          case ('idle'):
            break
          case ('jump'):
            jump = true
            break
          case ('dash'):
            dash = true
            break
          case ('dashJump'):
            dash = true
            jump = true
            break
        }
      }

      input = {
        player1: {
          jump: this.keys.oneJump.isDown,
          dash: this.keys.oneDash.isDown
        },
        player2: {
          jump: jump,
          dash: dash
        }
      }
    }

    this.gameObj.update(delta, input)

    this.gameState = this.gameObj.getState()

    if (!this.prevState.over && this.gameState.over) {
      this.gameOver = true
    }

    if (this.gameOver) {
      this.gameOverTime += delta
    }

    if (this.gameOverTime > this.gameOverTimer) {
      if(!this.fading) {
        this.cameras.main.fadeOut(750)
        this.fading = true
      }
    }

    if (this.prevState.over && !this.gameState.over) {
      if (this.gameState.matchOver) {
        if (this.local) {
          this.scene.start('LocalWinner', { winner: this.gameState.winner})
        } else {
          if (this.gameState.winner === 'player1') {
            if (this.stageConfig.nextStage === 'over') {
              this.scene.start('AIEnd', { won: false, stage: 'one', over: true })
            } else {
              this.scene.start('AIEnd', { won: true, stage: this.stageConfig.nextStage })
            }
          } else {
            this.scene.start('AIEnd', { won: false, stage: this.stage })
          }
        }
      } else {
        this.newGame()
      }
    }

    this.player1.update(this.gameState.player1.state)
    this.player2.update(this.gameState.player2.state)

    this.HUD.update()

    if (this.gameState.powerUpsScr.length !== this.prevState.powerUpsScrLen) {
      this.addPowerUps()
    }

    this.prevState = {
      over: this.gameState.over,
      powerUpsScrLen: this.gameState.powerUpsScr.length
    }
  }

  addPowerUps () {
    this.powerUps.clear(true, true)

    this.gameState.powerUpsScr.map(item => {
      this.powerUps.add(this.add.sprite(item.x + 6, item.y + 6, item.name))
    })
  }

  createAnimations () {
    if (this.anims.anims) {
      this.anims.anims.clear()
    }

    this.animsArray.map(item => {
      let sheet = this.animsConfig[item].sheet

      this.animsConfig[item].anims.map(anim => {
        this.anims.create({
          key: anim.key,
          frames: this.anims.generateFrameNumbers(sheet, anim.frames),
          frameRate: anim.frameRate ? anim.frameRate : 1,
          repeat: anim.repeat ? anim.repeat : -1,
          repeatDelay: anim.repeatDelay ? anim.repeatDelay : 0
        })
      })
    })
  }

  colors () {
    return ['9fddf2', '6eefd3', 'e2c973', 'ccc9c1', 'adacab']
  }

  clearKeys () {
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.L)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.K)
  }
}