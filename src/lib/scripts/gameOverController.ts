import type { GameController } from '#lib/scripts/gameController.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { getInputState } from '#lib/scripts/game/player/inputManager.ts'

const CONTINUE_TIMEOUT = 3000

export class GameOverController {
	events = CoolEvents.map({
		continued(_wave: number) {},
		selectedItemChanged() {},
	})
	selectedIndex = 0
	private poller: { stop(): void }
	chosen = -1
	constructor(public gc: GameController) {
		this.poller = makeInputPoller({
			move: (delta: number) => {
				this.selectedIndex =
					(this.selectedIndex + delta + this.menuItems.length) % this.menuItems.length
				this.events.selectedItemChanged.emit()
			},
			accept: () => {
				this.chosen = this.selectedIndex
				if (this.selectedIndex === 0) {
					this.continue()
				} else {
					this.end()
				}
			},
		})
	}
	get menuItems() {
		return [
			{
				text: 'Continue',
			},
			{
				text: 'End Game',
			},
		]
	}
	private continue() {
		const { game } = this.gc
		if (!game) {
			return
		}
		game.continued()
		this.done()
		setTimeout(() => {
			this.gc.preWave()
		}, CONTINUE_TIMEOUT)
		this.events.continued.emit(game.wave)
	}
	private end() {
		this.gc.endGame()
		this.done()
	}
	private done() {
		this.poller.stop()
	}
}

function makeInputPoller(handlers: { move(delta: number): void; accept(): void }) {
	let finished = false
	let prevState = getInputState()
	function tick() {
		const currentState = getInputState()
		const moved = currentState.moveY !== 0 && currentState.moveY !== prevState.moveY
		if (moved) {
			handlers.move(Math.sign(currentState.moveY))
		}
		const accepted =
			(currentState.button1 && !prevState.button1) || (currentState.button2 && !prevState.button2)
		if (accepted) {
			handlers.accept()
			finished = true
		}
		prevState = currentState
		if (!finished) {
			requestAnimationFrame(tick)
		}
	}
	tick()
	return {
		stop() {
			finished = true
		},
	}
}
