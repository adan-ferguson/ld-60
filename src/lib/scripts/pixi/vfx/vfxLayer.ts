import { Container } from 'pixi.js'
import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'

export class VfxLayer extends Container {
	private animations: Set<VfxAnimation> = new Set()
	addAnimation(animation: VfxAnimation) {
		this.animations.add(animation)
		this.addChild(animation.pixiEl)
	}
	update(delta: number) {
		for (const animation of [...this.animations]) {
			animation.update(delta)
			if (animation.isFinished) {
				this.removeChild(animation.pixiEl)
				this.animations.delete(animation)
			}
		}
	}

	clear() {
		for (const anim of this.animations.values()) {
			this.removeChild(anim.pixiEl)
			anim.pixiEl.destroy()
		}
		this.animations.clear()
	}
}
