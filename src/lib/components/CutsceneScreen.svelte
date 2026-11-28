<script lang="ts">
  import type {CutscenePhase} from '#lib/scripts/gameController.ts'
  const { phase }: { phase: CutscenePhase } = $props()
  const cutscene = $derived(phase.cutscene)
  $effect(() => {
    return cutscene.events.textRenderRequested.listen((text, xy) => {

    })
  })
</script>
<div class="mid-wave-overlay">
  Thank you for playtesting, todo: put cutscene here
</div>
