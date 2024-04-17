<script lang="ts">
  import { renderFunction } from '@/common/core/slots/render-slots'

  export default {
    setup() {
      return () => {
        return renderFunction()
      }
    }
  }
</script>
