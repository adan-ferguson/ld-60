<script lang="ts">

  import type {GameController} from '#lib/scripts/gameController.ts'
  import {onMount} from 'svelte'

  const { gc }: {gc: GameController } = $props()

  let wave = $state("")
  let score = $state(0)
  let lives = $state(0)
  let levelName = $state("")
  let darkMode = $state(false)

  const scoreDisplay = $derived(score.toString().padStart(12, '0'))

  onMount(() => {
    return gc.updated.listen(() => {
      score = gc.game?.score ?? 0
      wave = gc.game ? gc.game.wave.toString() : ""
      lives = gc.game?.lives ?? 0
      levelName = gc.game?.level?.levelDef.displayName ?? ""
      darkMode = gc.phase.kind !== 'wave'
    })
  })
</script>

<div
  class="size-full main"
  class:dark-mode={darkMode}
>
  <div class="top">
    {levelName}
  </div>
  <div class="bottom">
    <div class="lives-and-score">
      {lives}x
      <img src="/assets/sprites/man-icon.png" alt="Lives">
      {scoreDisplay}
    </div>
    <div>
      Wave {wave}
    </div>
  </div>
</div>

<style>
  div.main {
    z-index: 10;
    color: black;
    pointer-events: none;
    &.dark-mode {
      color: white;
    }
  }
  .top {
    position: absolute;
    top: 0.5cqh;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .bottom {
    position: absolute;
    left: 5cqh;
    right: 5cqh;
    bottom: 0.5cqh;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    img {
      width: 3cqh;
      height: 3cqh;
      margin-left: -1cqh;
    }
  }
</style>