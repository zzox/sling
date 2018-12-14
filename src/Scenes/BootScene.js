export default class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    })
  }

  preload()
  {
    this.resize()

    this.load.audioSprite('audio', 
      'assets/audio/sling-audio.json',
      [
        'assets/audio/sling-audio.mp3',
        'assets/audio/sling-audio.ac3',
        'assets/audio/sling-audio.m4a',
        'assets/audio/sling-audio.ogg',
      ], 
      {
        instances: 4
      }
    )

    this.load.bitmapFont('font', 'assets/fonts/manaspace.png', 'assets/fonts/manaspace.fnt')

    this.load.json('animations', 'assets/data/animations.json')
    this.load.json('stages', 'assets/data/stages.json')
  }
  
  create()
  {
    window.addEventListener('resize', () => {
      this.resize()
    })

    this.scene.start('TitleScene')
  }

  resize () {
    const maxMulti = 4
    const w = 192
    const h = 120
    const availW = window.innerWidth
    const availH = window.innerHeight
    // - 20 for padding
    const maxW = Math.floor(availW / w)
    const maxH = Math.floor(availH / h)
    let multi = maxW < maxH ? maxW : maxH

    if (multi > maxMulti) multi = maxMulti

    let canvas = document.getElementsByTagName('canvas')[0]
    canvas.style.width = `${multi * w}px`
    canvas.style.height = `${multi * h}px`
  }
}