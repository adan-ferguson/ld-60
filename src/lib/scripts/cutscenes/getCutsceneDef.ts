import { Cutscene, type CutsceneId } from '#lib/scripts/cutscenes/cutscene.ts'
import { cutsceneLoop1 } from '#lib/scripts/cutscenes/defs/cutsceneLoop1.ts'
import { cutsceneLoop2 } from '#lib/scripts/cutscenes/defs/cutsceneLoop2.ts'
import { cutsceneLoop3Worst } from '#lib/scripts/cutscenes/defs/cutsceneLoop3Worst.ts'
import { cutsceneLoop3AllTreasures } from '#lib/scripts/cutscenes/defs/cutsceneLoop3AllTreasures.ts'
import { cutsceneLoop3NoContinues } from '#lib/scripts/cutscenes/defs/cutsceneLoop3NoContinues.ts'
import { cutsceneLoop3Best } from '#lib/scripts/cutscenes/defs/cutsceneLoop3Best.ts'

const CUTSCENE_MAP: Record<CutsceneId, Cutscene> = {
	loop1: cutsceneLoop1(),
	loop2: cutsceneLoop2(),
	loop3_worst: cutsceneLoop3Worst(),
	loop3_all_treasures: cutsceneLoop3AllTreasures(),
	loop3_no_continues: cutsceneLoop3NoContinues(),
	loop3_best: cutsceneLoop3Best(),
}

export function createCutscene(id: CutsceneId): Cutscene {
	const cutscene = CUTSCENE_MAP[id]
	if (!cutscene) {
		throw 'Invalid cutscene id'
	}
	return cutscene
}
