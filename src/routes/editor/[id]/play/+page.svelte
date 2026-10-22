<script lang="ts">
  import SvGame from '#lib/components/SvGame.svelte'
  import { page } from '$app/state'
  let wave = $derived(page.params.id ? parseInt(page.params.id) : undefined)
</script>
<SvGame {wave}></SvGame>