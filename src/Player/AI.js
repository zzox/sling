export default class AI extends Phaser.GameObjects.Sprite {
  constructor(scene, position, config) {
    super(scene, position, config)
    scene.add.existing(this)
    // super(position)
    this.position = position
    this.player = `player${position}`
    this.scene = scene
    this.color = config.color
    this.animation = 'idle'
    this.setOrigin(0)
  }

  create () {
    if (this.position === 2) {
      // this.x = 100
      // this.y = 100
      this.flipX = true
    }

    this.colorParticles = this.scene.add.particles(`${this.color}-particle`)
    this.colorEmitter = this.colorParticles.createEmitter()
    this.colorEmitter.setPosition(this.x, this.y)
      .setSpeed(20)
      .setQuantity(2)
    this.colorEmitter.on = false

    this.whiteParticles = this.scene.add.particles('white-particle')
    this.whiteEmitter = this.whiteParticles.createEmitter()
    this.whiteEmitter.setPosition(this.x, this.y)
      .setSpeed(10)
      .setQuantity(1)
    this.whiteEmitter.on = false

    this.goldParticles = this.scene.add.particles('gold-particle')
    this.goldEmitter = this.goldParticles.createEmitter()
    this.goldEmitter.setPosition(this.x, this.y)
      .setSpeed(20)
      .setQuantity(5)
    this.goldEmitter.on = false

    this.purpleParticles = this.scene.add.particles('purple-particle')
    this.purpleEmitter = this.purpleParticles.createEmitter()
    this.purpleEmitter.setPosition(this.x, this.y)
      .setSpeed(20)
      .setQuantity(3)

    this.purpleEmitter.on = false

    // this.colorParticles = this.scene.add.particles(`${this.color}-particle`)
    // this.colorEmitter = this.colorParticles.createEmitter()
  }

  update (state) {

    if(!state) return

    this.x = state.x
    this.y = state.y

    if (state.inAir && (!state.won && !state.lost)) {
      this.animation = 'jump'
      this.particleHandler('white')
    } else {
      this.animation = 'idle'
      this.particleHandler('idle')
    }

    if (state.dashing) {
      this.animation = 'dash'
      if (!state.won && !state.lost) {
        this.particleHandler('color')
      }
    }

    if (state.won && state.dashing) {
      this.particleHandler('gold')
    } else if(state.lost) {
      this.particleHandler('purple')
    }

    this.anims.play(`${this.color}Player-${this.animation}`, true)
  }

  particleHandler (color) {
    switch (color) {
      case ('color'):
        if (!this.colorEmitter.on) {
          this.colorEmitter.on = true
          this.whiteEmitter.on = false
          this.colorEmitter.setPosition(this.x + 4, this.y + 8)
        } else {
          this.colorEmitter.setPosition(this.x + 4, this.y + 8)
        }
        break
      case ('white'):
        if (!this.whiteEmitter.on) {
          this.whiteEmitter.on = true
          this.colorEmitter.on = false
          this.whiteEmitter.setPosition(this.x + 6, this.y + 12)
        } else {
          this.whiteEmitter.setPosition(this.x + 6, this.y + 14)
        }
        break
      case ('gold'):
        if (!this.goldEmitter.on) {
          this.whiteEmitter.on = false
          this.colorEmitter.on = false
          this.goldEmitter.on = true
          this.goldEmitter.setPosition(this.x + 6, this.y + 12)
        } else {
          this.goldEmitter.setPosition(this.x + 6, this.y + 14)
        }
        break
      case ('purple'):
        if (!this.purpleEmitter.on) {
          this.whiteEmitter.on = false
          this.colorEmitter.on = false
          this.purpleEmitter.on = true
          this.purpleEmitter.setPosition(this.x + 6, this.y + 12)
        } else {
          this.purpleEmitter.setPosition(this.x + 6, this.y + 14)
        }        
        break
      case ('idle'):
        this.whiteEmitter.on = false
        this.colorEmitter.on = false
        this.goldEmitter.on = false
        this.purpleEmitter.on = false
        break
    }
  }
}