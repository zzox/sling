import 'phaser'
import BootScene from './Scenes/BootScene'
import TitleScene from './Scenes/TitleScene'
import GameScene from './Scenes/GameScene'
import LocalWinner from './Scenes/LocalWinner'
import AIEnd from './Scenes/AIEnd'

const config = {
  type: Phaser.WEBGL,
  parent: 'content',
  width: 192,
  height: 120,
  pixelArt: true,
  roundPixels: true,
  scene: [
    BootScene,
    TitleScene,
    GameScene,
    LocalWinner,
    AIEnd
  ],
  debug: true
}

const game = new Phaser.Game(config)