<script lang="ts">
	import '../app.css'
	import favicon from '#lib/assets/favicon.png'
	import fabricTexture from '#lib/assets/45-degree-fabric-light.png'
	import type { LayoutProps } from './$types'
	let { children }: LayoutProps = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="viewport"
	style:background-image="url({fabricTexture})"
	style:background-color="#133"
>
	<main class="play-area">
		{@render children()}
	</main>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;

		min-width: 100%;
		min-height: 100%;
	}

	.viewport {
		width: 100%;
		height: 100dvh;
		display: grid;
		place-items: center;
	}

	.play-area {
		width: min(100%, calc(100dvh * 16 / 9));
		aspect-ratio: 16 / 9;
		overflow: hidden;
		container-type: size;
		container-name: play-area;
		background-color: black;
		position: relative;
	}
</style>