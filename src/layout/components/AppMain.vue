<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <!-- 底部, 展示网站版权信息以及备案信息 -->
    <div v-if="$store.state.settings.showFooter" id="erp-main-footer">
        <span v-html="$store.state.settings.footerContent" />
        <span> · </span>
        <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}

#erp-main-footer {
    background: none repeat scroll 0 0 white;
    border-top: 1px solid #e7eaec;
    overflow: hidden;
    padding: 10px 6px 0 6px;
    height: 33px;
    font-size: 0.7rem !important;
    color: #7a8b9a;
    letter-spacing: 0.8px;
    font-family: Arial, sans-serif !important;
    position: fixed;
    bottom: 0;
    z-index: 99;
    width: 100%;
}
</style>
