export default class AIEnd extends Phaser.Scene {
  constructor(test) {
    super({ key: 'AIEnd' })
  }

  preload(){
    this.load.image('selector', 'assets/menu/selector.png')
  }

  create(){
    console.log(this.sys.settings.data)
    this.won = this.sys.settings.data.won
    this.stage = this.sys.settings.data.stage

    if (this.won) {
      this.add.bitmapText(80, 70, 'font', 'Next')
      this.add.bitmapText(80, 90, 'font', 'Quit')
    } else {      
      this.add.bitmapText(80, 70, 'font', 'Restart')
      this.add.bitmapText(80, 90, 'font', 'Quit')
    }

    if (this.won) {
      this.add.bitmapText(62, 20, 'font', 'You Won!')
    } else {
      this.add.bitmapText(56, 20, 'font', 'You Lost...')
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
      this.nextStage()
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

  nextStage () {
    this.clearKeys()
    this.scene.start('GameScene', { local: false, stage: this.stage })
  }

  quit () {
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