import { Cutscene } from '#lib/scripts/cutscenes/cutscene.ts'
import { ManActor } from '#lib/scripts/cutscenes/actors/manActor.ts'

export function cutsceneLoop1() {
	const princess = createPrincessActor()
	const man = createManActor()
	const redMan = createRedManActor()
	const cutscene = new Cutscene()
	cutscene.timeline
		.addThreshold(0, () => {
			cutscene.addChild(princess, man)
			princess.x = 200
			princess.y = 0
			princess.run(-4)
			man.x = 0
			man.y = 0
			man.run(4)
		})
		.addThreshold(3, () => {
			princess.stand()
			man.stand()
		})
		.addThreshold(3.1, () => {
			cutscene.addChild(redMan)
		})

	return cutscene
}

function createPrincessActor() {
	const actor = new ManActor()
	actor.sprite.tint = 'hotpink'
	return actor
}

function createManActor() {
	const actor = new ManActor()
	actor.sprite.tint = 'cyan'
	return actor
}

function createRedManActor() {
	const actor = new ManActor()
	actor.sprite.tint = 'red'
	return actor
}
