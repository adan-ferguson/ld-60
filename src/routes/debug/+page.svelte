<script lang="ts">

  import {Game} from '#lib/scripts/game/game.ts'
	import { resolve } from '$app/paths'

  const game = new Game()

</script>

{#each game.levels as level (level.id)}
  <a href={resolve("/debug/[id]", { id: String(level.id) })}>
    {level.displayName}
  </a>
{/each}

<style>
</style>