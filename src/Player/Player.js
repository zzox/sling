export default class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, position, color) {
		super(scene, position)
		scene.add.existing(this)
		console.log(scene)
		// super(position)
		this.position = position
		this.player = `player${position}`
		this.scene = scene
		this.color = color
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

		// this.colorParticles = this.scene.add.particles(`${this.color}-particle`)
		// this.colorEmitter = this.colorParticles.createEmitter()

		console.log(this.colorEmitter)
	}

	update (state) {

		if(!state) return

		this.x = state.x
		this.y = state.y



		this.colorEmitter.setPosition(this.x, this.y)
    this.colorEmitter.setSpeed(20)

    if (state.inAir) {
    	this.animation = 'jump'
    } else {
    	this.animation = 'idle'
    }

    if (state.dashing) {
    	this.animation = 'dash'
    }

		this.anims.play(`${this.color}Player-${this.animation}`, true)
	}
}