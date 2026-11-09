<script lang="ts">
  import type {FlyingTextController} from '#lib/scripts/sv/flyingTextController.svelte.ts'
  import {onMount} from 'svelte'
  import {Consts} from '#lib/scripts/consts.ts'

  const { controller }: {
    controller: FlyingTextController
  } = $props()

  let overlay: HTMLDivElement
  let scale = $state(1)

  function updateScale() {
    const rect = overlay.getBoundingClientRect()
    scale = rect.width / Consts.GAME_WIDTH
  }

  onMount(() => {
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(overlay)
    return () => observer.disconnect()
  })

</script>

<div
  bind:this={overlay}
  class="size-full"
>
  <div
    class="game-space"
    style:transform={`scale(${scale})`}
  >
    {#each controller.instances as instance (instance.def.uuid)}
      <div
        class="flying-text"
        style:left={`${instance.currentPosition.x}px`}
        style:top={`${instance.currentPosition.y}px`}
        style:opacity={1 - instance.t * instance.t}
      >
        {instance.def.text}
      </div>
    {/each}
  </div>
</div>

<style>
  .game-space {
    position: absolute;
    width: 256px;
    height: 144px;
    transform-origin: top left;
  }
  .flying-text {
    position: absolute;
    transform: translate(-50%, -50%);
    /*white-space: nowrap;*/
    pointer-events: none;
    font-size: 4px;
    color: lime;
    letter-spacing: 0;
  }
</style>