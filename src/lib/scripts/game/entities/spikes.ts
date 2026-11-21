import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { SpikesEl } from '#lib/scripts/pixi/entities/spikesEl.ts'
import { Consts } from '#lib/scripts/consts.ts'

export class Spikes extends GameEntity {
	public override get isHazard() {
		return true
	}
	update2(_delta: number): void {}
	createPixiEl(gc: GameController): GameEntityEl {
		return new SpikesEl(gc, this)
	}
	get baseWidth(): number {
		return Consts.TILE_SIZE_PX
	}
	get baseHeight(): number {
		return Consts.TILE_SIZE_PX
	}
}
