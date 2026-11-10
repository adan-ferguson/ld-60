export type LevelInfo = {
	wave: number
	treasureFound: boolean
}

export class TreasureManager {
	#treasures = new Map<number, boolean>()
	get collectedCount() {
		return [...this.#treasures.values()].filter((v) => v).length
	}
	get rows() {
		const rows: LevelInfo[][] = []
		for (let r = 0; r < 3; r++) {
			const row: LevelInfo[] = []
			rows.push(row)
			let anyInRow = false
			for (let c = 1; c <= 10; c++) {
				const val = this.#treasures.get(c + r * 10)
				row.push({
					treasureFound: val ?? false,
					wave: c + r * 10,
				})
				if (val !== undefined) {
					anyInRow = true
				}
			}
			if (!anyInRow) {
				break
			}
		}
		return rows
	}
	set(wave: number, collected: boolean) {
		// TODO: ensure wave is an integer from 1 to 30
		this.#treasures.set(wave, collected)
	}
}
