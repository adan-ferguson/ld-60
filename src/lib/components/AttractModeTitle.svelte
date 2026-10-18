<script lang="ts">

  import {onMount} from 'svelte'
  import {Random} from '#lib/scripts/utils/random.ts'

  let crazyPoints = $state<HTMLSpanElement>()
  let creditsText = $state("Credits 999")
  let showText = $state(false)

  onMount(() => {
    const i = setInterval(() => {
      if(crazyPoints){
        crazyPoints.style.color = randomColor()
      }
    }, 0)
    const j = setInterval(() => {
      if(creditsText !== "Press Start"){
        creditsText = "Press Start"
      } else {
        creditsText = "Credits 999"
      }
    }, 2000)
    setTimeout(() => {
      showText = true
    }, 1000)
    return () => {
      clearInterval(i)
      clearInterval(j)
    }
  })

  function randomColor(){
    // Not actually random, just choose from like 8
    return Random.chooseOne(['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'magenta'])!
  }

</script>

<div class="size-full main">
  <div class="logo-window">
    <img
      class="logo"
      src="/assets/logo.png"
      alt="Khananaphone Electronics"
    />
  </div>
  {#if showText}
    <div class="copy">
      <p>PRESENTED BY:</p>
      <p>KHANANAPHONE ELECTRONICS INC. LTD</p>
      <p>EXTRA CQUABBLER EVERY <span bind:this={crazyPoints}>25000 POINTS</span></p>
      <p>(C) 1986 KHANANAPHONE ELECTRONICS INC. LTD</p>
    </div>
    <div class="credits">{creditsText}</div>
  {/if}
</div>

<style>
  .main {
    font-family: 'Silkscreen', monospace;
    color: white;
    font-size: 4cqh;
  }
  .logo-window {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;

    display: grid;
    place-items: center;

    overflow: hidden;

    animation: logo-window-wipe 900ms steps(12, end) both;
  }

  .logo {
    display: block;

    height: 100%;
    width: auto;

    max-height: 100%;

    object-fit: contain;
    object-position: center;

    image-rendering: pixelated;

    animation: logo-reveal 900ms steps(12, end) both;
  }

  .copy {
    text-align: center;
    position: absolute;
    width: 100%;
    top: 50%;
    font-size: 4cqh;
  }
  .credits {
    position: absolute;
    bottom: 2cqh;
    width: 100%;
    text-align: center;
  }

  @keyframes logo-window-wipe {
    from {
      clip-path: inset(0 100% 0 0);
    }

    to {
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes logo-reveal {
    from {
      transform: translateX(-4%);
    }

    to {
      transform: translateX(0);
    }
  }
</style>