import { Container } from 'pixi.js'
import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'

export class VfxLayer extends Container {
	addAnimation(animation: VfxAnimation) {
		this.addChild(animation)
	}
	update(deltaMS: number) {
		const children = [...this.children]
		for (const child of children) {
			if (child instanceof VfxAnimation) {
				child.update(deltaMS)
				if (child.isFinished) {
					this.removeChild(child)
				}
			}
		}
	}
}
