import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { Phanta } from '#lib/scripts/game/entities/phanta.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'
import { Assets, Graphics, Sprite } from 'pixi.js'
import { Intervaler } from '#lib/scripts/utils/intervaler.ts'
import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { Random } from '#lib/scripts/utils/random.ts'
import { spiralSpawnAnimation } from '#lib/scripts/pixi/vfx/spiralSpawnAnimation.ts'

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
	#smokeEmitter: Intervaler | undefined
	#sprite: Sprite | undefined
	constructor(
		gc: GameController,
		private phanta: Phanta,
	) {
		super(gc, phanta)
		this.#playSpawnAnimation()
		phanta.events.flyingAway.listen(() => {
			if (!this.#sprite) {
				return
			}
			this.#sprite.texture = Assets.get('phantameh')
		})
		phanta.events.spawned.listen(() => {
			if (phanta.flyingAway) {
				return
			}
			this.#create()
		})
	}
	override update2(delta: number) {
		this.#smokeEmitter?.add(delta)
		this.scale.x = this.phanta.playerOnRight ? 1 : -1
	}
	#create() {
		this.#sprite = makeSprite()
		this.addChild(this.#sprite)
		this.#smokeEmitter = new Intervaler(() => {
			const smokeParticle = new Graphics()
			smokeParticle.rect(-1, -1, 2, 2).fill(this.phanta.flyingAway ? 'white' : 'red')
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
	}
	#playSpawnAnimation() {
		this.gc.addAnimation(
			spiralSpawnAnimation({
				targetPosition: this.position,
				duration: 1.5,
				color: 'red',
			}),
		)
	}
}

function makeSprite() {
	return new Sprite({
		texture: Assets.get('phanta'),
		anchor: { x: 0.5, y: 0.5 },
	})
}
