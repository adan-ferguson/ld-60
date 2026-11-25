<script lang="ts">
	import type { GameOverPhase } from "#lib/scripts/gameController.ts"
  import TreasureMap from '#lib/components/TreasureMap.svelte'
  import selectedArrow from '#lib/assets/sprites/selected-arrow.png'
  import {CoolEvents} from '#lib/scripts/utils/coolEvents.ts'
  import {SfxPlayer} from '#lib/scripts/audio/sfxPlayer.ts'
  const { phase }: {
    phase: GameOverPhase
  } = $props()

  const goc = $derived(phase.gameOverController)
  const game = $derived(goc.gc.game!)
  let selected = $derived(goc.selectedIndex)
  let chosen = $derived(goc.chosen)
  let currentWave = $derived(game.wave)

  $effect(() => {
    return CoolEvents.subscribe(goc.events, {
      continued(wave: number){
        SfxPlayer.play('treasure')
        chosen = 0
        setTimeout(() => {
          const i = setInterval(() => {
            if(currentWave > wave){
              currentWave--
              SfxPlayer.play('enemyDeath')
            } else {
              clearInterval(i)
            }
          }, 400)
        }, 1000)
      },
      selectedItemChanged(){
        selected = goc.selectedIndex
      }
    })
  })

</script>
<div class="mid-wave-overlay">
  <div>Game Over</div>
  <ul>
    {#each goc.menuItems as item, i (i)}
      <li class:chosen={chosen === i}>
        <img alt="selected arrow" class="selected-arrow" style:visibility={selected === i ? 'visible' : 'hidden'} src={selectedArrow}>
        {item.text}
      </li>
    {/each}
  </ul>
  <TreasureMap treasureManager={game.treasures} {currentWave}/>
</div>

<style>
  li {
    &.chosen {
      color: lime;
    }
    list-style: none;
    margin-left: -2em;
    img {
      height: 0.5em;
      position: relative;
      top: -0.05em;
    }
  }
</style>