import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '../langs/index'

Vue.use(VueI18n)

let lang = 'en'

if (process.browser) {
  const locale = localStorage.getItem('lang') || navigator.language.substr(0, 2).toLowerCase()
  lang = !messages[locale] ? 'en' : locale
}

const dateTimeFormats = {
  en: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  },
  fr: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  },
  tr: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  },
  jp: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  },
  kr: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  }
}

const numberFormats = {
  en: {
    compact: {
      notation: 'compact'
    }
  },
  fr: {
    compact: {
      notation: 'compact'
    }
  },
  jp: {
    compact: {
      notation: 'compact'
    }
  },
  kr: {
    compact: {
      notation: 'compact'
    }
  },
  tr: {
    compact: {
      notation: 'compact'
    }
  }
}

// Create VueI18n instance with options
export default ({ app, route, store }) => {
  app.i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages,
    silentFallbackWarn: true,
    dateTimeFormats,
    numberFormats
  })

  if (lang === 'zh') {
    lang += '-cn'
  }
}
