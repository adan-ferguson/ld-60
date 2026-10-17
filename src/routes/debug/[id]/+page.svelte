<script lang="ts">
  import { page } from '$app/state'
  import {onMount} from 'svelte'
  import {initGame} from '#lib/scripts/initGame.ts'

  let canvas: HTMLCanvasElement
  onMount(async () => {
    const gc = await initGame(canvas)
    if(page.params.id !== undefined) {
      gc.setLevel(page.params.id)
    }
  })

</script>
<canvas bind:this={canvas} class="size-full"></canvas>