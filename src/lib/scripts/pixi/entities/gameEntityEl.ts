import { Container, Graphics, type Rectangle } from 'pixi.js'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { flatRect } from '#lib/scripts/utils/flatRect.ts'
import type CoolRect from '#lib/scripts/utils/coolRect.ts'

const DEBUG = false

export abstract class GameEntityEl extends Container {
	private debugGfx: Graphics
	protected get debugRects(): CoolRect[] {
		return []
	}
	constructor(
		protected gc: GameController,
		protected entity: GameEntity,
	) {
		super()
		this.zIndex = 0
		this.addChild((this.debugGfx = new Graphics()))
	}
	public update(delta: number) {
		this.x = Math.round(this.entity.x * Consts.RESOLUTION) / Consts.RESOLUTION
		this.y = Math.round(this.entity.y * Consts.RESOLUTION) / Consts.RESOLUTION
		if (DEBUG) {
			this.debugGfx
				.clear()
				.rect(...this.entity.localBounds.asXywh())
				.stroke({ color: 0x00ff00, width: 0.25 })
			this.debugRects.forEach((r) => {
				this.debugGfx.rect(...r.asXywh()).stroke({ color: 0x0000ff, width: 0.25 })
			})
		}
		this.update2(delta)
	}
	public update2(_delta: number) {}
}
