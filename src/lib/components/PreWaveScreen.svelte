<script lang="ts">
  import {GameController} from '#lib/scripts/gameController.ts'
  import TreasureMap from '#lib/components/TreasureMap.svelte'
  const {  gc }: {
    gc: GameController
  } = $props()
</script>
<div class="mid-wave-overlay">
  <p>Get Ready</p>
  <TreasureMap treasureManager={gc.game!.treasures} currentWave={gc.game!.wave}/>
</div>