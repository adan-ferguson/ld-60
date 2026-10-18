<script lang="ts">

  import {initGame} from '#lib/scripts/initGame.ts'

  let canvas: HTMLCanvasElement
  import {onMount} from 'svelte'
  import HudOverlay from '#lib/components/HudOverlay.svelte'
  import type {GameController} from '#lib/scripts/gameController.ts'
  import AttractModeTitle from '#lib/components/AttractModeTitle.svelte'

  let gc = $state<GameController>()
  let started = $state(false)

  onMount(async () => {
    gc = await initGame(canvas)
    gc.started.listen(() => {
      started = true
    })
  })

</script>
<canvas bind:this={canvas} class="size-full"></canvas>
{#if !started}
  <AttractModeTitle></AttractModeTitle>
{:else if gc}
  <HudOverlay {gc}></HudOverlay>
{/if}