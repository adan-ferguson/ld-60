import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

export type SongName = 'bossfight' | 'none'

type SongDef = {
	leadin: string
	main: string
}

const rp = AssetUtils.requestPreload
rp({
	alias: 'bossfight-leadin',
	src: '/assets/music/bossfightleadin.ogg',
})
rp({
	alias: 'bossfight',
	src: '/assets/music/bossfight.ogg',
})

const songMap: Record<SongName, SongDef | undefined> = {
	bossfight: {
		leadin: 'bossfight-leadin',
		main: 'bossfight',
	},
	none: undefined,
}

export const MusicPlayer = {
	play(song: SongName) {
		MusicPlayer.stop()
		const songDef = songMap[song]
		if (!songDef) {
			return
		}
		// ??
	},
	stop() {
		// ??
	},
}
