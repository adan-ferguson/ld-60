<script lang="ts">

  import {onMount} from 'svelte'
  import {Random} from '#lib/scripts/utils/random.ts'

  let crazyPoints = $state<HTMLSpanElement>()

  onMount(() => {
    setInterval(() => {
      if(crazyPoints){
        crazyPoints.style.color = randomColor()
      }
    })
  })

  function randomColor(){
    // Not actually random, just choose from like 8
    return Random.chooseOne(['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'magenta'])!
  }

</script>

<div class="size-full main">
  <img class="logo" alt="title" src="/assets/logo.png">
  <div class="copy">
    <p>PRESENTED BY:</p>
    <p>KHANANAPHONE ELECTRONICS INC. LTD</p>
    <p>EXTRA CQUABBLER EVERY <span bind:this={crazyPoints}>25000 POINTS</span></p>
    <p>(C) 1986 KHANANAPHONE ELECTRONICAL CORP, ESQ</p>
  </div>
  <div class="credits">Credits 9999</div>
</div>

<style>
  .main {
    font-family: 'Silkscreen', monospace;
  }
  .logo {
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
    color: white;
  }
  .credits {
    position: absolute;
    bottom: 5cqh;
    width: 100%;
    text-align: center;
  }
</style>