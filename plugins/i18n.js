import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '../langs/index'
/**
 * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
 * @param choicesLength {number} an overall amount of available choices
 * @returns a final choice index to select plural word by
 **/
VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  // this === VueI18n instance, so the locale property also exists here
  // add the word "only" if the value is greater than 1 and less than 5
  if (this.locale !== 'ru') {
    if (choice === 0 || choice === 1) {
      return choice
    }

    if (choice > 1 && choice < 5) {
      return 2
    }

    return 3
  }

  // comply with the rules of the Russian language

  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1

  if (!teen && endsWithOne) {
    return 1
  }

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

Vue.use(VueI18n)

let lang = 'en'

if (process.browser) {
  const locale =
    localStorage.getItem('lang') ||
    navigator.language.substr(0, 2).toLowerCase()
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
      hour12: true,
    },
  },
  fr: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
  },
  tr: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
  },
  jp: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
  },
  kr: {
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
  },
}

const numberFormats = {
  en: {
    compact: {
      notation: 'compact',
    },
  },
  fr: {
    compact: {
      notation: 'compact',
    },
  },
  jp: {
    compact: {
      notation: 'compact',
    },
  },
  kr: {
    compact: {
      notation: 'compact',
    },
  },
  tr: {
    compact: {
      notation: 'compact',
    },
  },
}

// Create VueI18n instance with options
export default ({ app, route, store }) => {
  app.i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages,
    silentFallbackWarn: true,
    dateTimeFormats,
    numberFormats,
  })

  if (lang === 'zh') {
    lang += '-cn'
  }

  // app.$moment.locale(lang)
}
