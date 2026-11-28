import { Container } from 'pixi.js'
import type { XY } from '#lib/scripts/utils/XY.ts'

export abstract class CutsceneActor extends Container {
	velocity: XY = { x: 0, y: 0 }
	constructor() {
		super()
	}
	update(delta: number) {
		this.x += this.velocity.x * delta
		this.y += this.velocity.y * delta
	}
}
