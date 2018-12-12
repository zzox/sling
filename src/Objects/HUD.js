export default class HUD {
	constructor (scene) {
		this.scene = scene

    this.scene.add.graphics({ fillStyle: { color: 0x878787 } })
      .fillRectShape(new Phaser.Geom.Rectangle(0, 0, 192, 24))
      .setScrollFactor(0, 0)

    this.display = this.scene.add.bitmapText(40, 14, 'font', '')

    this.player1points = this.scene.add.group()
    this.player2points = this.scene.add.group()

    this.player1PowerUps = this.scene.add.group()
    this.player2PowerUps = this.scene.add.group()

    this.score = { 
      player1: 0, 
      player2: 0 
    }
	}

	update () {
    if (this.score.player1 !== this.scene.gameState.score.player1) {
      this.score.player1 = this.scene.gameState.score.player1
      this.drawPoints(1)
    }

    if (this.score.player2 !== this.scene.gameState.score.player2) {
      this.score.player2 = this.scene.gameState.score.player2
      this.drawPoints(2)
    }

    switch (this.scene.gameState.display) {
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
	}

	drawPoints (playerNo) {
		let group = this[`player${playerNo}points`].clear(true, true)

		if (playerNo === 1) {
			for(let i = 0; i < this.score.player1; i++){
				group.add(this.scene.add.image(i * 6 + 3, 6, `${this.scene.player1Color}Point`))
			}
		}

		if (playerNo === 2) {
			for(let i = this.score.player2; i > 0; i--){
				group.add(this.scene.add.image(i * -6 + 195, 6, `${this.scene.player2Color}Point`))
			}
		}
	}

	clearPowerUps () {

	}
}