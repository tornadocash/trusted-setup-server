module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Tornado Trusted Setup Ceremony',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { name: 'theme-color', content: '#000403' },
      {
        hid: 'description',
        name: 'description',
        content: 'Non-custodial Ethereum Privacy solution.'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Tornado Trusted Setup Ceremony'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Non-custodial, trustless, serverless, private transactions on Ethereum network'
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
        content: 'Non-custodial, trustless, serverless, private transactions on Ethereum network'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'Mixer, Ethereum, ERC20, dapp, smart contract, decentralized, metamask, zksnark, zero knowledge'
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
  loading: { color: '#94febf', height: '5px', duration: 5000 },
  /*
   ** Global CSS
   */
  css: ['@/assets/styles/app.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
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
    ],
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
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
    extend(config, ctx) {},
    html: {
      minify: {
        collapseWhitespace: true, // as @dario30186 mentioned
        removeComments: true // 👈 add this line
      }
    }
  }
}
