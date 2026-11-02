import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { Phanta } from '#lib/scripts/game/entities/phanta.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'
import { Assets, Graphics, Sprite } from 'pixi.js'
import { Intervaler } from '#lib/scripts/utils/intervaler.ts'
import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { Random } from '#lib/scripts/utils/random.ts'

AssetUtils.requestPreload({
	alias: 'phanta',
	src: '/assets/sprites/sparky.png',
})
AssetUtils.requestPreload({
	alias: 'phantameh',
	src: '/assets/sprites/sparkymeh.png',
})

const SMOKE_EMIT_INTERVAL = 0.35
const SMOKE_SPEED = 24

export class PhantaEl extends GameEntityEl {
	private smokeEmitter: Intervaler
	constructor(
		gc: GameController,
		private phanta: Phanta,
	) {
		super(gc, phanta)
		const sprite = makeSprite()
		let flyingAway = false
		this.addChild(sprite)
		this.smokeEmitter = new Intervaler(() => {
			const smokeParticle = new Graphics()
			smokeParticle.rect(-1, -1, 2, 2).fill(flyingAway ? 'white' : 'red')
			smokeParticle.x = this.x + Random.between(-4, 4)
			smokeParticle.y = this.y
			this.gc.addAnimation(
				new VfxAnimation(smokeParticle, {
					update({ t, delta }) {
						smokeParticle.alpha = 1 - t
						smokeParticle.y -= delta * SMOKE_SPEED
					},
					duration: 0.8,
				}),
			)
		}, SMOKE_EMIT_INTERVAL)
		phanta.flyingAway.listen(() => {
			flyingAway = true
			sprite.texture = Assets.get('phantameh')
		})
	}
	override update2(delta: number) {
		this.smokeEmitter.add(delta)
		this.scale.x = this.phanta.playerOnRight ? 1 : -1
	}
}

function makeSprite() {
	return new Sprite({
		texture: Assets.get('phanta'),
		anchor: { x: 0.5, y: 0.5 },
	})
}
