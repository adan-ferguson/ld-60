import { error } from '@sveltejs/kit'
import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'

export function load({ params }) {
	const wave = Number(params.wave)
	if (!LevelsManager.isValidWave(wave)) {
		throw error(400, 'Invalid wave')
	}
	return { wave }
}
