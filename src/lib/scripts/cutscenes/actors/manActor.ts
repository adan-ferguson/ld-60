import { CutsceneActor } from '#lib/scripts/cutscenes/cutsceneActor.ts'
import { ManSprite } from '#lib/scripts/pixi/entities/manSprite.ts'

export class ManActor extends CutsceneActor {
	sprite: ManSprite
	constructor() {
		super()
		this.sprite = new ManSprite()
		this.addChild(this.sprite)
	}
	run(speed: number) {
		const dir = Math.sign(speed)
		this.scale.set(dir, 1)
		this.velocity = { x: speed, y: 0 }
		this.sprite.run()
	}
	stand() {
		this.velocity = { x: 0, y: 0 }
		this.sprite.stand()
	}
}
