export class TreasureManager {
	#treasures = new Map<number, boolean>()
	get collectedCount() {
		return [...this.#treasures.values()].filter((v) => v).length
	}
	set(wave: number, collected: boolean) {
		// TODO: ensure wave is an integer from 1 to 30
		this.#treasures.set(wave, collected)
	}
}
