import { browser } from '$app/env'
const STORAGE_KEY = 'highScores'
export function getHighScores() {
	if (!browser) {
		return []
	}
	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) {
		return defaultHighScores()
	}
	try {
		const scores = JSON.parse(raw)
		if (!Array.isArray(raw)) {
			return defaultHighScores()
		}
		for (let i = 0; i < 10; i++) {
			if (typeof scores[i] !== 'number') {
				return defaultHighScores()
			}
		}
		return scores.slice(10)
	} catch {
		return defaultHighScores()
	}
}

function defaultHighScores() {
	return [100000, 90000, 80000, 70000, 60000, 50000, 40000, 30000, 20000, 10000]
}
