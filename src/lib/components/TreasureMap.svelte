<script lang="ts">
  import type {TreasureManager} from '#lib/scripts/game/treasureManager.ts'
  const { treasureManager, currentWave }:{
    treasureManager: TreasureManager,
    currentWave: number
  } = $props()
</script>

<div>
  {#each treasureManager.rows as row,i (i)}
    <div class="treasure-row">
      {#each row as level, j (j)}
        <div class="treasure-cell" class:current={level.wave === currentWave}>
          {#if level.treasureFound}
            <img class="treasure found" src="/assets/sprites/treasure.png" alt="treasure"/>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .treasure-row {
    display: flex;
  }
  .treasure-cell {
    width: 1em;
    height: 1em;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.1em solid white;
    &.current {
      border-color: limegreen;
    }
  }
  .treasure {
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin: 0;
    image-rendering: pixelated;
  }
</style>