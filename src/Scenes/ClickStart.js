export default class ClickStart extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'ClickStart'
    })
  }
  
  create()
  {
    this.add.bitmapText(20, 20, 'font', 'click screen')

    this.start = false
  }

  update() {
    // prevent switching problems, maybe not needed
    if (this.start) {
      return
    }

    if (this.input.activePointer.isDown) {
      this.start = true
      this.scene.start('TitleScene')
    }
  }
}