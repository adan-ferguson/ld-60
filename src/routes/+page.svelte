<script lang="ts">

  import {initGame} from '#lib/scripts/initGame.ts'

  let canvas: HTMLCanvasElement
  import {onMount} from 'svelte'

  onMount(async () => {
    initGame(canvas)
  })

</script>
<canvas bind:this={canvas} class="size-full"></canvas>