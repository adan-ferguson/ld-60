<script lang="ts">

  import type {GameController} from '#lib/scripts/gameController.ts'
  import {onMount} from 'svelte'

  const { gc }: {gc: GameController } = $props()

  let wave = $state("")
  let score = $state(0)
  let lives = $state(0)

  const scoreDisplay = $derived(score.toString().padStart(12, '0'))

  onMount(() => {
    return gc.updated.listen(() => {
      score = gc.game?.score ?? 0
      wave = gc.game ? gc.game.wave.toString() : ""
      lives = gc.game?.lives ?? 0
    })
  })
</script>

<div
  class="size-full main"
>
  <div class="top">
    Wave {wave}
  </div>
  <div class="bottom">
    <div class="lives-and-score">
      {lives}x
      <img src="/assets/sprites/man-icon.png" alt="Lives">
      {scoreDisplay}
    </div>
    <div style:font-size="2cqh">
      Khananaphone Electronics Co., Ltd.
    </div>
  </div>
</div>

<style>
  div.main {
    z-index: 10;
    color: #000;
    font-family: 'Silkscreen', monospace;
    pointer-events: none;
    font-size: 3cqh;
    line-height: 1;
    font-weight: 400;
    text-rendering: geometricPrecision;
  }
  .top {
    position: absolute;
    top: 1cqh;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .bottom {
    position: absolute;
    left: 5cqh;
    right: 5cqh;
    bottom: 1cqh;

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