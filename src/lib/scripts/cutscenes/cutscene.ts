import { Container } from 'pixi.js'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { getCutsceneDef } from '#lib/scripts/cutscenes/getCutsceneDef.ts'
import { CutsceneTimeline } from '#lib/scripts/cutscenes/cutsceneTimeline.ts'

type CutsceneActor = undefined

type CutsceneEvent = (
	| { kind: 'showText'; text: string; duration?: number }
	| { kind: 'hideText' }
	| { kind: 'spawnActor'; actor: CutsceneActor }
	| { kind: 'move'; actor: string; to: XY; duration: number }
	| { kind: 'animate'; actor: string; animation: string }
	| { kind: 'wait'; duration: number }
) & { at: number }

export type CutsceneId =
	'loop1' | 'loop2' | 'loop3_worst' | 'loop3_all_treasures' | 'loop3_no_continues' | 'loop3_best'

export type CutsceneDef = {
	events: CutsceneEvent[]
}

export class Cutscene {
	public container: Container
	public finished = CoolEvents.createHandler()
	#def: CutsceneDef
	#timeline: CutsceneTimeline
	constructor(id: CutsceneId) {
		this.container = new Container()
		this.#def = getCutsceneDef(id)
		this.#timeline = new CutsceneTimeline(this.#def.events)
	}
	update(delta: number) {
		this.#timeline.update(delta)
		// something something
	}
}
