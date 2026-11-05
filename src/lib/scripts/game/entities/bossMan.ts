import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Man } from '#lib/scripts/game/entities/man.ts'
import type { ManAnimationType } from '#lib/scripts/pixi/entities/manEl.ts'
import { GenericState } from '#lib/scripts/game/genericState.ts'

export class BossMan extends Man {
	iterations = 0
	state: State
	constructor(level: LevelInstance) {
		super(level, {
			health: 16 * level.loops,
			scale: 2,
			facing: -1,
		})
		this.state = new RunningState()
	}
	get defaultAnimation(): ManAnimationType {
		return 'run'
	}
	public update2(delta: number) {
		this.state.update(this, delta)
		const { player } = this.level
		if (player && this.worldBounds.pad({ y: -3 }).intersects(player.worldBounds)) {
			player.takeDamage(1)
		}
	}
}

abstract class State extends GenericState<BossMan> {
	abstract get animation(): ManAnimationType
}

class RunningState extends State {
	get animation() {
		return 'run' as const
	}
	update2(owner: BossMan) {
		owner.velX = 40 * owner.facing
		if (!owner.hasGroundAhead()) {
			owner.facing *= -1
			owner.velX = 0
			owner.state = new AttackWindupState()
		}
	}
}

class AttackWindupState extends State {
	get animation() {
		return 'attackWindup' as const
	}
	update2(owner: BossMan, delta: number) {}
}

class AttackState extends State {
	get animation() {
		return 'attack' as const
	}
	update2(owner: BossMan, delta: number) {}
}
