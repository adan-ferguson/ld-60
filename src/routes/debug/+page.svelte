<script lang="ts">
	import { resolve } from '$app/paths'
  import {LevelsManager} from '#lib/scripts/game/levelsManager.ts'
</script>

<div>
  <b>Levels</b>
  <ul>
    {#each LevelsManager.instance.levels.values() as level (level.id)}
      <li>
        <a href={resolve("/debug/[id]", { id: String(level.id) })}>
          {level.displayName}
        </a>
      </li>
    {/each}
  </ul>
</div>

<style>
</style>