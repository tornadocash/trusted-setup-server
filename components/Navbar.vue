<template>
  <b-navbar wrapper-class="container" class="header">
    <template slot="brand">
      <b-navbar-item :to="{ path: '/' }" tag="router-link">
        <img src="../assets/img/sherpalogo.png" />
        <div class="sherpa-header-label">Sherpa</div>
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item tag="router-link" to="/instructions">
        <div>{{ $t('pages.header.instructions') }}</div>
      </b-navbar-item>
      <b-navbar-item>
        <b-dropdown
          v-model="$i18n.locale"
          @change="langChange"
          class="dropdown-langs"
          position="is-top-left"
          aria-role="list"
        >
          <b-button slot="trigger" type="is-icon">
            <FlagIcon :code="$i18n.locale" :class="'is-active-locale-' + $i18n.locale" />
          </b-button>

          <b-dropdown-item
            v-for="locale in locales"
            :key="locale"
            :value="locale"
            aria-role="listitem"
          >
            <FlagIcon :code="locale" />
            {{ printLang(locale) }}
          </b-dropdown-item>
        </b-dropdown>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { FlagIcon } from '@/components/icons'

export default {
  components: {
    FlagIcon
  },
  computed: {
    locales() {
      return this.$i18n.availableLocales
    }
  },
  methods: {
    langChange(lang) {
      localStorage.setItem('lang', lang)

      if (lang === 'zh') {
        lang += '-cn'
      }
    },
    printLang(lang) {
      let code = lang
      switch (code) {
        case 'zh':
          code = 'cn'
          break
      }
      return code.toUpperCase()
    }
  }
}
</script>
