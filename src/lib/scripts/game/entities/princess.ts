import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { PrincessEl } from '#lib/scripts/pixi/entities/princessEl.ts'

export class Princess extends GameEntity {
	get baseHeight(): number {
		return 12
	}

	get baseWidth(): number {
		return 8
	}

	createPixiEl(gc: GameController): GameEntityEl {
		return new PrincessEl(gc, this)
	}

	update2(): void {
		const { player } = this.level
		if (player && this.worldBounds.pad({ y: -3 }).intersects(player.worldBounds)) {
			this.level.princessRescued()
		}
	}
}
