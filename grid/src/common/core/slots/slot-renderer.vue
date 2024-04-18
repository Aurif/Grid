<script lang="ts">
  import { renderFunction } from '@/common/core/slots/root-slot'

  export default {
    setup() {
      return () => {
        return renderFunction()
      }
    }
  }
</script>
