module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Sherpa.cash Trusted Setup Ceremony',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { name: 'theme-color', content: '#000403' },
      {
        hid: 'description',
        name: 'description',
        content: 'Non-custodial Privacy solution on Avalanche.'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Sherpa.cash Trusted Setup Ceremony'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          "Improve security of sherpa.cash by contributing to Trusted Setup Ceremony. Let's make it fully trustless!"
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://ceremony.tornado.cash'
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://tornado.cash/tw.png'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          "Improve security of sherpa.cash by contributing to Trusted Setup Ceremony. Let's make it fully trustless!"
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'Mixer, Avalanche, dapp, smart contract, decentralized, metamask, zksnark, zero knowledge'
      }
    ],
    link: [
      { rel: 'manifest', href: 'manifest.json' },
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=PT+Mono&display=swap'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#138198', height: '5px', duration: 5000 },
  /*
   ** Global CSS
   */
  css: ['@/assets/styles/app.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~plugins/phase2', ssr: false }, '~plugins/highlight', '~plugins/i18n.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    [
      'nuxt-buefy',
      {
        css: false,
        materialDesignIcons: false
      }
    ]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader')
      })
    },
    html: {
      minify: {
        collapseWhitespace: true, // as @dario30186 mentioned
        removeComments: true // 👈 add this line
      }
    }
  },
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  env: {
    hashtag: process.env.TWITTER_HASHTAG,
    downloadUrl: process.env.AWS_CONTRIBUTION_URL
  }
}
