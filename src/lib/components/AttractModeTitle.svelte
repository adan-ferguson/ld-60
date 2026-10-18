<script lang="ts">

  import {onMount} from 'svelte'
  import {Random} from '#lib/scripts/utils/random.ts'

  let crazyPoints = $state<HTMLSpanElement>()
  let creditsText = $state("Credits 999")

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
    return () => clearInterval(i)
  })

  function randomColor(){
    // Not actually random, just choose from like 8
    return Random.chooseOne(['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'magenta'])!
  }

</script>

<div class="size-full main">
  <div class="logo"></div>
  <div class="copy">
    <p>PRESENTED BY:</p>
    <p>KHANANAPHONE ELECTRONICS INC. LTD</p>
    <p>EXTRA CQUABBLER EVERY <span bind:this={crazyPoints}>25000 POINTS</span></p>
    <p>(C) 1986 KHANANAPHONE ELECTRONICAL CORP, ESQ</p>
  </div>
  <div class="credits">{creditsText}</div>
</div>

<style>
  .main {
    font-family: 'Silkscreen', monospace;
    color: white;
    font-size: 4cqh;
  }
  .logo {
    background: url('/assets/logo.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 50%;
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
</style>