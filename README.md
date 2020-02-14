# zip-files
compress and package files to zip

```html
<h1>{title}</h1>
<span>count: {count}</span>
<button onclick={add}>add</button>
<button onclick={reset}>reset</button>

<script>
const title = 'Counter'
const initCount = 0

export default function () {
  const state = {
    count: initCount
  }
  const add = () => {
    $: state.count++
  }
  const reset = () => {
    $: state.count = initCount
  }
}
</script>

<style>
button {
  margin: 0 10px;
}
</style>

```
