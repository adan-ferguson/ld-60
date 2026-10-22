<script lang="ts">
	import type { GameOverPhase } from "#lib/scripts/gameController.ts"
  const { phase }: {
    phase: GameOverPhase
  } = $props()

</script>
<div class="cover-everything">
  <div>Game Over</div>
  <div>{phase.score.toString().padStart(12, '0')}</div>
  {#if phase.isHighScore}
    <div class="crazy-text">New High Score!</div>
  {/if}
</div>