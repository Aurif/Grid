import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
export function determinePositioning(anchor: Ref<HTMLElement | undefined>): { columns: Ref<number>; rows: Ref<number> } {
  const letterSize = 30
  const xScale = 1.667
  const yScale = 1.34

  const columns = ref(0)
  const rows = ref(0)

  let resizeObserver = new ResizeObserver((entries) => {
    let entry = entries[0]
    columns.value = Math.floor(entry.target.clientWidth / (letterSize / xScale) / 1.7)
    rows.value = Math.floor(entry.target.clientHeight / (letterSize / yScale) / 1.7)
  })
  
  onMounted(() => { if(anchor.value) resizeObserver.observe(anchor.value) })
  onUnmounted(() => { if(anchor.value) resizeObserver.disconnect() })
  watch(anchor, (newAnchor: HTMLElement | undefined) => {
    if(newAnchor) resizeObserver.observe(newAnchor)
  })

  return { columns, rows }
}
