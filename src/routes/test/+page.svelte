<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
  let waveInput = $state(1)
</script>
<div>
  <label>
    Wave <input id="wave" type="number" min="1" max="99" bind:value={waveInput}/>
  </label>
  <button onclick={() => {
    goto(resolve("/test/[wave]", { wave : waveInput.toString() }))
  }}>Test</button>
</div>