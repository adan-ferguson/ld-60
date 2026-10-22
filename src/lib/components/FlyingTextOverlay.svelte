<script lang="ts">
  import type {FlyingTextController} from '#lib/scripts/sv/flyingTextController.svelte.ts'

  const { controller }: {
    controller: FlyingTextController
  } = $props()

</script>

<div
  class="size-full"
>
  {#each controller.instances as instance (instance.def.uuid)}
    <div
      class="flying-text"
      style:left={`${instance.currentPosition.x}px`}
      style:top={`${instance.currentPosition.y}px`}
    >
      {instance.def.text}
    </div>
  {/each}
</div>