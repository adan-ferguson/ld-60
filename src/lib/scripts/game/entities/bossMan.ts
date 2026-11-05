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
		})
		this.state = new RunningState()
	}
	get defaultAnimation(): ManAnimationType {
		return 'run'
	}
	public update2(delta: number) {
		this.state.update(this, delta)
	}
}

abstract class State extends GenericState<BossMan> {
	abstract get animation(): ManAnimationType
}

class RunningState extends State {
	get animation() {
		return 'run' as const
	}
	update2(owner: BossMan, delta: number) {}
}

class AttackWindupState extends State {
	get animation() {
		return 'attackWindup' as const
	}
	update2(owner: BossMan, delta: number){}
}

class AttackState extends State {
	get animation() {
		return 'attack' as const
	}
	update2(owner: BossMan, delta: number){}
}
