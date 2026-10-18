<script lang="ts">
  import { page } from '$app/state'
  import {onMount} from 'svelte'
  import {initGame} from '#lib/scripts/initGame.ts'
  import HudOverlay from '#lib/components/HudOverlay.svelte'
  import type {GameController} from '#lib/scripts/gameController.ts'

  let canvas: HTMLCanvasElement
  let gc = $state<GameController>()
  onMount(async () => {
    gc = await initGame(canvas)
    if(page.params.id !== undefined) {
      gc.startGame(Number(page.params.id))
    }
  })

</script>
<canvas bind:this={canvas} class="size-full"></canvas>
{#if gc}
  <HudOverlay {gc}></HudOverlay>
{/if}