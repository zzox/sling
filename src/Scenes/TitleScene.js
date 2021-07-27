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
      upKey: true,
      downKey: true,
      startKey: true,
      startKeyAlt: true
    }

    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.startKeyAlt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)

    this.cameras.main.fadeIn(2000)

    this.music = this.sound.playAudioSprite('audio', 'theme', { loop: true })
  }

  update(){
    if ((this.startKey.isDown && !this.prevState.startKey) || (this.startKeyAlt.isDown && !this.prevState.startKeyAlt)) {
      if(this.menuPos === 1){
        this.pauseMusic()
        this.vsAI()
        return
      } else if(this.menuPos === 2){
        this.pauseMusic()
        this.local()
        return
      }
    }

    if(this.upKey.isDown && this.upKey.isDown !== this.prevState.upKey){
      if(this.menuPos === 1){
        this.menuPos = this.menuPositions // only for main
      } else {
        this.menuPos--
      }

      this.sound.playAudioSprite('audio', 'selector', { volume: 0.5 })
    }

    if(this.downKey.isDown && this.downKey.isDown !== this.prevState.downKey){
      if(this.menuPos === this.menuPositions){
        this.menuPos = 1 // only for main
      } else {
        this.menuPos++
      }

      this.sound.playAudioSprite('audio', 'selector', { volume: 0.5 })
    }

    this.spr.y = this.menuPos * 20 + 54

    this.prevState = {
      upKey: this.upKey.isDown,
      downKey: this.downKey.isDown,
      startKey: this.startKey.isDown,
      startKeyAlt: this.startKeyAlt.isDown
    }
  }

  vsAI(){
    this.clearKeys()
    this.scene.start('GameScene', { local: false, stage: 'one' })
  }

  local(){
    this.clearKeys()
    this.scene.start('GameScene', { local: true })
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
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.X)
  }
}
