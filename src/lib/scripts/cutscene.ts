import { Container } from 'pixi.js'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'

export class Cutscene {
	public container: Container
	public finished = CoolEvents.createHandler()
	constructor(index: number) {
		this.container = new Container()
	}
	update(delta: number) {}
}
