<script lang="ts">

  import type {GameController} from '#lib/scripts/gameController.ts'
  import {onMount} from 'svelte'

  const { gc }: {gc: GameController } = $props()

  let wave = $state(1)
  let currentScore = $state(0)
  let lives = $state(0)

  const SCORE_ROLLING_SPEED = 1000
  const scoreDisplay = $derived(currentScore.toString().padStart(12, '0'))

  onMount(() => {
    currentScore = gc.game?.score ?? 0
    return gc.updated.listen((delta) => {
      updateScore(delta, gc.game?.score ?? 0)
      wave = gc.game?.wave ?? 1
      lives = gc.game?.lives ?? 0
    })
  })

  function updateScore(delta: number, targetScore: number) {
    if (targetScore === currentScore) {
      return
    }
    if (targetScore < currentScore) {
      currentScore = targetScore
    } else {
      const change = Math.round(
        Math.min(targetScore - currentScore, delta * SCORE_ROLLING_SPEED),
      )
      currentScore += change
    }
  }
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