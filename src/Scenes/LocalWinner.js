export default class LocalWinner extends Phaser.Scene {
  constructor(test) {
    super({ key: 'LocalWinner' })
  }

  preload(){
    this.load.image('selector', 'assets/menu/selector.png')

  }

  create(){
    this.add.bitmapText(80, 70, 'font', 'Restart')
    this.add.bitmapText(80, 90, 'font', 'Quit')

    this.winner = this.sys.settings.data.winner

    if (this.winner === 'player1') {
      this.add.bitmapText(55, 20, 'font', 'Player 1 Wins!')
    } else {
      this.add.bitmapText(55, 20, 'font', 'Player 2 Wins!')
    }

    this.menuPositions = 2
    this.menuPos = 1

    this.spr = this.add.sprite(68, 67, 'selector')

    this.prevState = {
      moveKey: true,
      startKey: true      
    }

    this.moveKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

    this.cameras.main.fadeIn(2000)
  }

  update(){
    if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 1){
      this.pauseMusic()
      this.restart()
      return
    } else if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2){
      this.pauseMusic()
      this.quit()
    }

    if(this.moveKey.isDown && this.moveKey.isDown !== this.prevState.moveKey){
      if(this.menuPos === this.menuPositions){
        this.menuPos = 1 // only for main
      } else {
        this.menuPos++
      }
      
      this.sound.playAudioSprite('audio', 'selector', { volume: 0.5 })
    }

    this.spr.y = this.menuPos * 20 + 54

    this.prevState = {
      moveKey: this.moveKey.isDown,
      startKey: this.startKey.isDown
    }
  }

  restart(){
    this.clearKeys()
    this.scene.start('GameScene', { local: true })
  }

  quit(){
    this.clearKeys()
    this.scene.start('TitleScene')
  }

  pauseMusic () {
    let sounds = this.sound.sounds
    for(let i = 0; i < sounds.length; i++) {
      if(sounds[i].key === 'audio') {
        this.sound.sounds[i].pause()
      }
    }
  }

  clearKeys () {
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S)
  }

}