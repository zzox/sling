import io from 'socket.io-client'
import Player from '../Player/Player'

export default class GameScene extends Phaser.Scene {
  constructor (config) {
    super({
      key: 'GameScene'
    })

    this.gameId = ''
  }

  preload () {

    //listen output
    // get gameid
    this.socket = io('http://localhost:5000')

    this.socket.on('connect', function(item){
      console.log('connected!!!')
    })

    this.socket.on('gameId', gameId => {
      this.gameId = gameId
    })

    this.socket.on('gameState', gameState => {
      this.gameState = gameState
    })


    // change to dynamic loading colors
    this.load.image('green-particle', 'assets/particles/greenParticle.png')
    this.load.image('gray-particle', 'assets/particles/grayParticle.png')
    this.load.image('white-particle', 'assets/particles/whiteParticle.png')
    this.load.image('gold-particle', 'assets/particles/goldParticle.png')
    this.load.image('purple-particle', 'assets/particles/purpleParticle.png')

    this.load.image('fast', 'assets/powerups/fast.png')
    this.load.image('faster', 'assets/powerups/faster.png')
    this.load.image('threeJumps', 'assets/powerups/threeJumps.png')
    this.load.image('fourJumps', 'assets/powerups/fourJumps.png')
    this.load.image('fire', 'assets/powerups/fire.png')

    this.stage = 'stage1'

    this.animsConfig = this.sys.cache.json.entries.entries.animations

    this.load.spritesheet('greenPlayer', `assets/players/greenPlayer.png`, { frameWidth: 14, frameHeight: 14, spacing: 2, margin: 1 })
    this.load.spritesheet('grayPlayer', `assets/players/grayPlayer.png`, { frameWidth: 14, frameHeight: 14, spacing: 2, margin: 1 })
    this.load.spritesheet(`slingTile1`, `assets/tilesets/slingTile1.png`, { frameWidth: 12, frameHeight: 12, spacing: 2, margin: 1 })
    this.load.tilemapTiledJSON(this.stage, `assets/tilemaps/${this.stage}.json`)
  }

  create () {
    // this.add.bitmapText(20, 20, 'font', 'start coding!')
    this.animsArray = ['greenPlayer', 'grayPlayer']
    this.createAnimations()

    this.map = this.make.tilemap({
      key: this.stage
    })

    this.cameras.main
      .setBackgroundColor(`#${'878787'}`)

    this.contactTileSet = this.map.addTilesetImage('slingTile1', `slingTile1`)
    this.contactLayer = this.map.createDynamicLayer('contactLayer', this.contactTileSet, 0, 0)

    this.add.graphics({ fillStyle: { color: 0x000000 } })
      .fillRectShape(new Phaser.Geom.Rectangle(0, 0, 192, 12))
      .setScrollFactor(0, 0)

    this.display = this.add.bitmapText(40, 40, 'font', '')
    this.player1score = this.add.bitmapText(2, 2, 'font', '0')
    this.player2score = this.add.bitmapText(184, 2, 'font', '0')
    
    this.score = { 
      player1: 0, 
      player2: 0 
    }

    this.keys = {
      oneJump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      oneDash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      twoJump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
      twoDash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
    }

    this.player1 = new Player(this, 1, 'green')
    this.player2 = new Player(this, 2, 'gray')

    this.player1.create()
    this.player2.create()

    this.gameState = {
      player1: {
        x: 29,
        y: 149,
        inAir: false,
        dashing: false,
        lost: false,
        won: false
      },
      player2: {
        x: 211,
        y: 149,
        inAir: false,
        dashing: false,
        lost: false,
        won: false
      },
      score: {
        player1: 0,
        player2: 0
      }
    }

    this.prevState = {
      over: false
    }

    this.newGame()
  }

  newGame () {
    this.cameras.main
      .fadeIn(500)

    this.gameOverTimer = 1000
    this.gameOverTime = 0
    this.gameOver = false
    this.fading = false
  }

  update (t, delta) {

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

      } else {
        this.newGame()
      }
    }

    this.player1.update(this.gameState.player1.state)
    this.player2.update(this.gameState.player2.state)

    let input = {
      oneJump: this.keys.oneJump.isDown,
      oneDash: this.keys.oneDash.isDown,
      twoJump: this.keys.twoJump.isDown,
      twoDash: this.keys.twoDash.isDown
    }

    //emit input(gameid)
    this.socket.emit('gameInput', {
      gameId: this.gameId,
      player1: {
        jump: input.oneJump,
        dash: input.oneDash
      },
      player2: {
        jump: input.twoJump,
        dash: input.twoDash
      }
    })

    if (this.score.player1 !== this.gameState.score.player1 ||
      this.score.player2 !== this.gameState.score.player2) {

      console.log('new score!')

      this.player1score.text = this.gameState.score.player1.toString()
      this.player2score.text = this.gameState.score.player2.toString()
      this.score = this.gameState.score
    }

    // if (this.gameState.over) {
      // console.log('over')
      switch (this.gameState.display) {
        case ('count3'):
          this.display.text = '        3'
          break
        case ('count2'):
          this.display.text = '        2'
          break
        case ('count1'):
          this.display.text = '        1'
          break
        case ('go'):
          this.display.text = '       GO!'
          break
        case ('onehit'):
          this.display.text = ' Player 1 hits!'
          break
        case ('twohit'):
          this.display.text = ' Player 2 hits!'
          break
        case ('one'):
          this.display.text = ' Player 1 wins.'
          break
        case ('two'):
          this.display.text = ' Player 2 wins.'
          break
        case ('tie'):
          this.display.text = '  It\'s a tie!'
          break
        case ('draw'):
          this.display.text = '     Draw...'
          break
        case (''):
          this.display.text = ''
          break
      }

    this.prevState = {
      over: this.gameState.over,
      powerups: this.gameState.powerups
    }
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

  clearKeys () {
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.L)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.K)
  }
}