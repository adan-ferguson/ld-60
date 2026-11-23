import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Man } from '#lib/scripts/game/entities/man.ts'
import type { ManAnimationType } from '#lib/scripts/pixi/entities/manEl.ts'
import { GenericState } from '#lib/scripts/game/genericState.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import { MusicPlayer } from '#lib/scripts/audio/musicPlayer.ts'
import { SfxPlayer } from '#lib/scripts/audio/sfxPlayer.ts'

export class BossMan extends Man {
	iterations = 0
	private state: State
	constructor(level: LevelInstance) {
		super(level, {
			health: [24, 48, 96][level.loops - 1],
			scale: 2,
			facing: -1,
		})
		this.state = new RunningState()
		this.destroyed.listen(() => {
			MusicPlayer.stop()
			SfxPlayer.play('bossKill')
		})
	}
	override get currentAnimation() {
		return this.state.animation
	}
	get defaultAnimation(): ManAnimationType {
		return 'run'
	}
	get loops() {
		return this.level.loops
	}
	update2(delta: number) {
		this.state.update(this, delta)
		const { player } = this.level
		if (
			player &&
			this.worldBounds.pad({ y: -3 }).intersects(player.toWorldBounds(player.hazardHurtbox))
		) {
			player.takeDamage(1)
		}
	}
	setState(newState: State) {
		this.state = newState
		this.flashInterval = newState.flashInterval
		this.animationChanged.emit()
	}
}

abstract class State extends GenericState<BossMan> {
	abstract get animation(): ManAnimationType
	get flashInterval(): number {
		return 0
	}
}

class RunningState extends State {
	get animation() {
		return 'run' as const
	}
	update2(owner: BossMan) {
		owner.velX = 32 * owner.facing * (1 + owner.iterations * 0.05)
		if (!owner.hasGroundAhead()) {
			owner.facing *= -1
			owner.velX = 0
			owner.setState(new AttackWindupState())
		}
	}
}

class AttackWindupState extends State {
	get animation() {
		return 'attackWindup' as const
	}
	update2(owner: BossMan) {
		if (this.time > 1.6) {
			owner.setState(new AttackState())
		}
	}
}

class AttackState extends State {
	constructor(private attackCount = 1) {
		super()
	}
	get animation() {
		return 'attack' as const
	}
	update2(owner: BossMan) {
		if (!this.time) {
			owner.playSfx('bossAttack')
			owner.level.entitiesManager.spawn(
				new Projectile(owner.level, {
					style: 'large',
					hitbox: { x: 4, y: 20 },
					wallHitbox: { x: 4, y: 24 },
					source: owner,
					lifetime: 15,
					velX: 85 * owner.facing,
					velY: 0,
					angle: Math.atan2(0, owner.facing),
					x: owner.x + 3 * owner.facing,
					y: owner.y - 1.5,
					tint: 'red',
				}),
			)
		}
		const shotTime = owner.loops === 3 ? 1.2 : 1.4
		if (this.time > shotTime) {
			if (this.attackCount < owner.loops) {
				owner.setState(new AttackState(this.attackCount + 1))
			}
		}
		if (this.time > 2) {
			owner.iterations++
			owner.setState(new RunningState())
		}
	}
}
