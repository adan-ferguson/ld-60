<script lang="ts">
  import {onMount} from 'svelte'
  import HudOverlay from '#lib/components/HudOverlay.svelte'
  import type {GameController, ScreenPhase} from '#lib/scripts/gameController.ts'
  import TitleScreen from '#lib/components/TitleScreen.svelte'
  import WaveScreen from '#lib/components/WaveScreen.svelte'
  import PostWaveScreen from '#lib/components/PostWaveScreen.svelte'
  import GameOverScreen from '#lib/components/GameOverScreen.svelte'
  import HighScoresScreen from '#lib/components/HighScoresScreen.svelte'
  import AttractModeScreen from '#lib/components/AttractModeScreen.svelte'
  import {initGame} from '#lib/scripts/initGame.ts'
  import FlyingTextOverlay from '#lib/components/FlyingTextOverlay.svelte'

  const { wave }: { wave?: number | undefined } = $props()

  let gc = $state<GameController>()
  let phase = $state<ScreenPhase>()
  let canvas: HTMLCanvasElement

  onMount(async () => {
    gc = await initGame(canvas, wave)
    phase = gc!.phase
    gc!.phaseChanged.listen(() => phase = gc!.phase)
  })

</script>
<canvas bind:this={canvas} class="size-full"></canvas>
{#if gc}
  <FlyingTextOverlay controller={gc.flyingTextController}></FlyingTextOverlay>
  <HudOverlay {gc}></HudOverlay>
  {#if phase}
    {#if phase.kind === 'title'}
      <TitleScreen></TitleScreen>
    {:else if gc.phase.kind === 'prewave'}
      <div class="mid-wave-overlay">
        Get Ready
      </div>
    {:else if gc.phase.kind === 'wave'}
      <WaveScreen></WaveScreen>
    {:else if gc.phase.kind === 'postwave'}
      <PostWaveScreen phase={gc.phase}></PostWaveScreen>
    {:else if gc.phase.kind === 'gameover'}
      <GameOverScreen phase={gc.phase}></GameOverScreen>
    {:else if gc.phase.kind === 'highscores'}
      <HighScoresScreen></HighScoresScreen>
    {:else if gc.phase.kind === 'attract'}
      <AttractModeScreen></AttractModeScreen>
    {/if}
  {/if}
{:else}
  <div class="size-full center-contents">
    <div>Loading...</div>
  </div>
{/if}