import { Assets, Container, Sprite, Text } from 'pixi.js'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

AssetUtils.requestPreload('/assets/sprites/man-icon.png', 'man-icon')

const { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE_PX } = Consts

const SCORE_ROLLING_SPEED = 1000

export class HudLayer extends Container {
	private waveText: Text
	private livesCount: Text
	private currentScore = 0
	private scoreText: Text
	constructor(private gc: GameController) {
		super()
		this.waveText = new Text({
			text: '',
		})
		this.scoreText = new Text({
			text: '',
		})
		const livesContainer = new Container()
		this.livesCount = new Text({
			text: '0x',
		})
		livesContainer.addChild(
			this.livesCount,
			new Sprite({
				tint: 'cyan',
				texture: Assets.get('man-icon'),
			}),
		)

		const companyNameLol = new Text({
			text: 'Khananaphone Electronics Co., Ltd.',
		})

		this.addChild(this.waveText, this.scoreText, livesContainer, companyNameLol)
	}
	update(delta: number) {
		this.waveText.text = `Wave ${this.gc.game.wave}`
		this.updateScore(delta)
	}
	updateScore(delta: number) {
		const targetScore = this.gc.game.score
		if (targetScore === this.currentScore) {
			return
		}
		if (targetScore < this.currentScore) {
			this.currentScore = targetScore
		} else {
			const change = Math.round(
				Math.min(targetScore - this.currentScore, delta * SCORE_ROLLING_SPEED),
			)
			this.currentScore += change
		}
		this.scoreText.text = this.currentScore.toString().padStart(12, '0')
	}
}
