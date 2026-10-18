import { browser } from '$app/env'
const STORAGE_KEY = 'highScores'

const MAX_HIGH_SCORES = 10

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
		if (!Array.isArray(scores)) {
			return defaultHighScores()
		}
		for (let i = 0; i < MAX_HIGH_SCORES; i++) {
			if (typeof scores[i] !== 'number') {
				return defaultHighScores()
			}
		}
		return scores.slice(0, MAX_HIGH_SCORES)
	} catch {
		return defaultHighScores()
	}
}

export function addHighScore(score: number): number[] {
	const scores = [...getHighScores(), Math.floor(score)]
		.sort((a, b) => b - a)
		.slice(0, MAX_HIGH_SCORES)

	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
	}

	return scores
}

export function isHighScore(score: number): boolean {
	const scores = getHighScores()
	return score > scores[scores.length - 1]
}

function defaultHighScores() {
	return [100000, 90000, 80000, 70000, 60000, 50000, 40000, 30000, 20000, 10000]
}
