<script lang="ts">

  import {initGame} from '#lib/scripts/initGame.ts'

  let canvas: HTMLCanvasElement
  import {onMount} from 'svelte'
  import HudOverlay from '#lib/components/HudOverlay.svelte'
  import type {GameController, ScreenPhase} from '#lib/scripts/gameController.ts'
  import AttractModeTitle from '#lib/components/AttractModeTitle.svelte'

  let gc = $state<GameController>()
  let started = $state(false)

  let phase = $state<ScreenPhase>()

  onMount(async () => {
    gc = await initGame(canvas)
    gc.started.listen(() => {
      started = true
    })
    gc.stopped.listen(() => {
      started = false
    })
    gc.phaseChanged.listen(p => {
      phase = p
    })
  })

</script>
<canvas bind:this={canvas} class="size-full"></canvas>
{#if !started}
  <AttractModeTitle></AttractModeTitle>
{:else if gc && gc.game && phase}
  {#if phase.kind === 'wave'}
    <HudOverlay {gc}></HudOverlay>
  {:else if phase.kind === 'prewave'}
    <div class="cover-everything">
      <div>Wave {phase.wave}</div>
    </div>
  {:else if phase.kind === 'postwave'}
    <div class="cover-everything">
      <div>Wave {gc.game.wave} Complete</div>
      <div>Time Bonus: {phase.bonuses.timeBonus}</div>
      <div>Wave Bonus: {phase.bonuses.waveBonus}</div>
      <div>Arbitrary Bonus: {phase.bonuses.arbitraryBonus}</div>
    </div>
  {:else if phase.kind === 'gameover'}
    <div class="cover-everything">
      <div>Game Over</div>
      <div>{phase.score.toString().padStart(12, '0')}</div>
      {#if phase.isHighScore}
        <div class="crazy-text">New High Score!</div>
      {/if}
    </div>
  {/if}
{/if}