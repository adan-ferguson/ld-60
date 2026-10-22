<script lang="ts">
  import SvGame from '#lib/components/SvGame.svelte'
  const { data } = $props()
</script>
<SvGame wave={data.wave}></SvGame>