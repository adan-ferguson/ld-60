<script lang="ts">
  import type {PostWavePhase} from '#lib/scripts/gameController.ts'
  const { phase }: { phase: PostWavePhase } = $props()
</script>
<div class="mid-wave-overlay">
  <div>Wave {phase.wave} Complete</div>
  <div>Wave Bonus: {phase.bonuses.waveBonus}</div>
  <div><img class="treasure" src="/assets/sprites/treasure.png" alt="treasure"/> Bonus: {phase.bonuses.treasureBonus}</div>
</div>

<style>
  .treasure {
    width: auto;
    height: 1em;
    margin-right: 0.5em;
    image-rendering: pixelated;
    vertical-align: middle;
  }
</style>