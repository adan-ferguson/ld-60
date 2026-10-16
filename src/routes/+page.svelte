<script lang="ts">

  import {initGame} from '#lib/scripts/initGame.ts'

  let canvas: HTMLCanvasElement
  import {onMount} from 'svelte'
  import SvelteLayer from '#lib/components/SvelteLayer.svelte'

  onMount(async () => {
    initGame(canvas)
  })

</script>

<canvas bind:this={canvas} class="size-full"></canvas>
<SvelteLayer></SvelteLayer>

<style>
</style>