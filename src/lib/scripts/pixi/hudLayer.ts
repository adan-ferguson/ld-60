import { Assets, Container, Sprite, Text, TextStyle } from 'pixi.js'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

AssetUtils.requestPreload({ src: '/assets/sprites/man-icon.png', alias: 'man-icon' })
AssetUtils.requestPreload({
	src: '/assets/fonts/Silkscreen-Regular.ttf',
	data: {
		family: 'Silkscreen',
		style: 'normal',
		weights: [400],
	},
})
AssetUtils.requestPreload({
	src: '/assets/fonts/Silkscreen-Bold.ttf',
	data: {
		family: 'Silkscreen',
		style: 'normal',
		weights: [700],
	},
})

const { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE_PX } = Consts

const SCORE_ROLLING_SPEED = 1000

export class HudLayer extends Container {
	private waveText: Text
	private livesCount: Text
	private currentScore = 0
	private scoreText: Text
	constructor(private gc: GameController) {
		super()
		console.log(document.fonts.check('6px Silkscreen'), document.fonts.check('700 6px Silkscreen'))
		const hudTextStyle = new TextStyle({
			fontFamily: 'Silkscreen',
			fontSize: 8,
			fontWeight: '400',
			fill: '#000000',
		})
		const botY = GAME_HEIGHT - TILE_SIZE_PX / 2
		this.waveText = new Text({
			text: '',
			style: hudTextStyle,
			anchor: { x: 0.5, y: 0.5 },
			position: { x: GAME_WIDTH / 2, y: TILE_SIZE_PX / 2 },
		})
		this.livesCount = new Text({
			text: '0x',
			style: hudTextStyle,
			anchor: { x: 0, y: 0.5 },
			position: { x: 8, y: botY },
		})
		const livesIcon = new Sprite({
			tint: 'cyan',
			texture: Assets.get('man-icon'),
			anchor: { x: 0, y: 0.5 },
			position: { x: 16, y: botY },
		})
		this.scoreText = new Text({
			text: '',
			style: hudTextStyle,
			anchor: { x: 0, y: 0.5 },
			position: { x: 20, y: botY },
		})
		const companyNameLol = new Text({
			text: 'Khananaphone Electronics Co., Ltd.',
			style: hudTextStyle,
			anchor: { x: 1, y: 0.5 },
			position: { x: GAME_WIDTH, y: botY },
			resolution: 2,
		})

		this.addChild(this.waveText, this.scoreText, this.livesCount, livesIcon, companyNameLol)
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
