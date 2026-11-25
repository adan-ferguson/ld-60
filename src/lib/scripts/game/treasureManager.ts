export type LevelInfo = {
	wave: number
	treasureFound: boolean
}

export class TreasureManager {
	#treasures = new Map<number, boolean>()
	get collectedCount() {
		return [...this.#treasures.values()].filter((v) => v).length
	}
	treasureMapRows(currentWave: number): LevelInfo[][] {
		const rows: LevelInfo[][] = []
		for (let wave = 1; wave <= 30; wave++) {
			const val = this.#treasures.get(wave)
			const { row, col } = toRowCol(wave)
			if (!rows[row]) {
				rows[row] = []
			}
			rows[row][col] = { wave, treasureFound: val ?? false }
		}
		const { row } = toRowCol(currentWave)
		return rows.slice(0, row + 1)
	}
	set(wave: number, collected: boolean) {
		// TODO: ensure wave is an integer from 1 to 30
		this.#treasures.set(wave, collected)
	}

	hasCollected(wave: number) {
		return this.#treasures.get(wave) ?? false
	}
}

function toRowCol(wave: number) {
	return {
		row: Math.floor((wave - 1) / 10),
		col: (wave - 1) % 10,
	}
}
