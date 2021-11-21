<template>
  <iFrame :src="swaggerUrl" />
</template>

<script>

import iFrame from '@/components/Iframe/index'

export default {
  name: 'Swagger',
  components: { iFrame },
  data() {
    const devUrl = 'http://localhost:9001/swagger-ui.html'
    const prodUrl = 'https://beiran.icu/swagger-ui.html'
    return {
      swaggerUrl: process.env.NODE_ENV === 'development' ? devUrl : prodUrl
    }
  }
}
</script>
