import { Container } from 'pixi.js'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'

export type CutsceneId =
	'loop1' | 'loop2' | 'loop3_worst' | 'loop3_all_treasure' | 'loop3_no_continues' | 'loop3_best'

export class Cutscene {
	public container: Container
	public finished = CoolEvents.createHandler()
	constructor(private id: CutsceneId) {
		this.container = new Container()
	}
	update(delta: number) {}
}
