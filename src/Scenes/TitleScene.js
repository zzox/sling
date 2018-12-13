export default class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({ key: 'TitleScene' })
  }

  preload(){
    this.load.image('selector', 'assets/menu/selector.png')
    this.load.image('title', 'assets/menu/sling.png')
  }

  create(){
    this.add.image(96, 26, 'title')
    this.add.bitmapText(80, 70, 'font', 'vs AI')
    this.add.bitmapText(80, 90, 'font', 'Local')

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

    this.music = this.sound.playAudioSprite('audio', 'theme', { loop: true })
  }

  update(){
    if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 1){
      this.pauseMusic()
      this.newGame()
      return
    } else if(this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2){
      this.loadGame()
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

  newGame(){
    this.clearKeys()
    this.scene.start('GameScene')
  }

  loadGame(){
    console.log("loading game")
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