<script lang="ts">
  import type {PostWavePhase} from '#lib/scripts/gameController.ts'
  const { phase }: { phase: PostWavePhase } = $props()
</script>
<div class="cover-everything">
  <div>Wave {phase.wave} Complete</div>
  <div>Time Bonus: {phase.bonuses.timeBonus}</div>
  <div>Wave Bonus: {phase.bonuses.waveBonus}</div>
  <div>Arbitrary Bonus: {phase.bonuses.arbitraryBonus}</div>
</div>