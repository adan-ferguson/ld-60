import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { Spikes } from '#lib/scripts/game/entities/spikes.ts'
import { Assets, Sprite } from 'pixi.js'

const ROTATION_SPEED = 4.5
const ROTATION_STEP = Math.PI / -8

export class SpikesEl extends GameEntityEl {
	private sprite: SpikesRotatingSprite
	constructor(gc: GameController, entity: Spikes) {
		super(gc, entity)
		this.sprite = new SpikesRotatingSprite()
		this.addChild(this.sprite)
	}
	protected update2(delta: number) {
		this.sprite.update(delta)
	}
}

export class SpikesRotatingSprite extends Sprite {
	private rotationCounter = 0
	constructor() {
		super({
			texture: Assets.get('spike'),
			anchor: { x: 0.5, y: 0.5 },
		})
	}
	update(delta: number) {
		this.rotationCounter += delta * ROTATION_SPEED
		this.rotation = Math.round(this.rotationCounter / ROTATION_STEP) * ROTATION_STEP
	}
}
