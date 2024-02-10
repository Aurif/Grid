import { ref, onMounted, onUnmounted } from 'vue'
export function determinePositioning() {
    const letterSize = 30;
    const xScale = 1.667;
    const yScale = 1.34;

    let columns = ref(0);
    let rows = ref(0);
    function resizeGrid() {
        columns.value = Math.floor(window.innerWidth / (letterSize / xScale) / 1.7);
        rows.value = Math.floor(window.innerHeight / (letterSize / yScale) / 1.7);
    }
    onMounted(() => window.addEventListener('resize', resizeGrid))
    onUnmounted(() => window.removeEventListener('resize', resizeGrid))
    resizeGrid();

    return { columns, rows };
}