import { TerrainLayer } from '#lib/scripts/pixi/terrain/terrainLayer.ts'
import { EntitiesLayer } from '#lib/scripts/pixi/entities/entitiesLayer.ts'
import { Container } from 'pixi.js'
import type { GameController } from '#lib/scripts/gameController.ts'
import { VfxLayer } from '#lib/scripts/pixi/vfx/vfxLayer.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { playerSpawnAnimation } from '#lib/scripts/pixi/vfx/playerSpawnAnimation.ts'

export class MainContainer extends Container {
	private terrainLayer: TerrainLayer
	private entitiesLayer: EntitiesLayer
	vfxLayer: VfxLayer
	constructor(private gc: GameController) {
		super()
		this.terrainLayer = new TerrainLayer()
		this.entitiesLayer = new EntitiesLayer(gc)
		this.vfxLayer = new VfxLayer()
		this.addChild(this.terrainLayer, this.entitiesLayer, this.vfxLayer)
		gc.phaseChanged.listen(() => {
			this.vfxLayer.clear()
			this.entitiesLayer.clear()
			this.terrainLayer.clear()
			if (gc.phase.kind === 'wave') {
				const level = gc.game!.level
				this.terrainLayer.setLevel(level)
				this.visible = true
			} else {
				this.visible = false
			}
		})
	}
	update(delta: number) {
		if (!this.visible) {
			return
		}
		this.entitiesLayer.update(delta)
		this.vfxLayer.update(delta)
	}
	beginLevel() {}

	showPlayerSpawnAnimation(level: LevelInstance) {
		return new Promise<void>((onFinished) => {
			this.vfxLayer.addAnimation(
				playerSpawnAnimation({
					targetPosition: level.playerSpawnPosition,
					onFinished,
				}),
			)
		})
	}
}
