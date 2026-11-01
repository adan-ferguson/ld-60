import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import Game from '#lib/scripts/game/game.ts'

import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { PhantaEl } from '#lib/scripts/pixi/entities/phantaEl.ts'

const INITIAL_SPEED = 5
const ACCEL = 0.4

export class Phanta extends GameEntity {
	constructor(game: Game, position: XY) {
		super(game)
		this.position = position
	}

	get isHazard() {
		return true
	}

	get w(): number {
		return 4
	}

	get h(): number {
		return 4
	}

	update2(delta: number): void {
		if (this.game.waveCleared) {
			this.destroy()
		}
		// TODO: move
	}

	createPixiEl(gc: GameController): GameEntityEl {
		return new PhantaEl(gc, this)
	}

	override async animateSpawn() {
		// TODO: animate spawn here
		// this.game.vfxManager.addEffect(new SpawnEffect(this.game, this.position))
	}
}
