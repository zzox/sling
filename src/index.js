import 'phaser'
import BootScene from './Scenes/BootScene'
import ClickStart from './Scenes/ClickStart'
import TitleScene from './Scenes/TitleScene'
import GameScene from './Scenes/GameScene'

const config = {
  type: Phaser.WEBGL,
  parent: 'content',
  width: 192,
  height: 120,
  pixelArt: true,
  roundPixels: true,
  scene: [
    BootScene,
    ClickStart,
    TitleScene,
    GameScene
  ],
  debug: true
}

const game = new Phaser.Game(config)