<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-spaced">
      Hello, <span>@{{ user.handle }}</span>
    </h1>
    <h2 class="subtitle">
      What way do you want to contribute to the Tornado.cash Trusted Setup Ceremony?
    </h2>
    <div class="columns is-centered">
      <div class="column is-one-third">
        <div
          :class="{ 'is-hovered': contributionType === 'anonymous' }"
          @click="onAnonymousHandler"
          class="box"
        >
          <div class="title is-5">Anonymously</div>
          <Cloak />
        </div>
      </div>
      <div class="column is-one-third">
        <div :class="{ 'is-hovered': isLoggedIn }" class="box">
          <div class="title is-5">Using a social account</div>
          <div v-if="isLoggedIn" class="fields">
            <b-field label="Name">
              <b-input v-model="user.name"></b-input>
            </b-field>
            <b-field label="Company">
              <b-input v-model="user.company"></b-input>
            </b-field>
          </div>
          <div v-else class="buttons">
            <b-button @click="logIn" type="is-primary" outlined expanded>
              SignIn via Twitter
            </b-button>
            <b-button @click="logIn" :disabled="true" type="is-primary" outlined expanded>
              SignIn via Github
            </b-button>
          </div>
        </div>
      </div>
    </div>

    <div v-show="status.type === 'is-danger' || status.type === 'is-success'" class="status">
      <div :class="status.type" class="status-message">{{ status.msg }}</div>
    </div>

    <div class="buttons is-centered">
      <b-button
        v-if="!isContributeBtnSnown"
        @click="makeContribution"
        :disabled="isContributeBtnDisabled"
        type="is-primary"
        outlined
      >
        Make the contribution
      </b-button>
      <b-button
        v-if="status.type === 'is-success'"
        @click="makeTweet"
        type="is-primary"
        tag="a"
        target="_blank"
        outlined
      >
        Tweet about your contribution
      </b-button>
    </div>
    <p class="p">
      If you don’t trust binaries, we encorage you to follow this <a href="">instruction</a> to
      contribute by compiling from source code. It is very easy!
    </p>

    <b-loading :active.sync="loading">
      <div class="loading-container">
        <div class="loading-tornado"></div>
        <div :class="status.type" class="loading-message">{{ status.msg }}...</div>
      </div>
    </b-loading>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Cloak from '@/components/Cloak'
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default {
  components: {
    Cloak
  },
  data() {
    return {
      contributionType: null,
      contributionIndex: null,
      isContributeBtnSnown: false,
      status: {
        type: '',
        msg: ''
      },
      user: { name: '', handle: 'Anonymous', company: '' },
      loading: false
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.user.name && this.user.name !== 'Anonymous'
    },
    isContributeBtnDisabled() {
      return !this.contributionType || (!this.isLoggedIn && this.contributionType !== 'anonymous')
    }
  },
  async mounted() {
    try {
      const response = await fetch('/api/user_data')
      const data = await response.json()
      console.log('data', data)
      if (data.name !== 'Anonymous') {
        this.user.handle = data.handle
        this.user.name = data.name
        // TODO check whether it's github or twitter
        this.contributionType = 'twitter'
      }
    } catch (e) {
      console.error('user_data fail', e)
    }
  },
  methods: {
    makeTweet() {
      const tweetText = `Just made the contribution %23${this.contributionIndex} to Tornado.cash Trusted Setup Ceremony! 🚀`
      const popUpWindowWidth = 600
      const popUpWindowHeight = 250
      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY

      const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width
      const height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height

      const systemZoom = width / window.screen.availWidth
      const left = (width - popUpWindowWidth) / 2 / systemZoom + dualScreenLeft
      const top = (height - popUpWindowHeight) / 2 / systemZoom + dualScreenTop
      window.open(
        `https://twitter.com/intent/tweet?text=${tweetText}`,
        '',
        `menubar=no,toolbar=no,resizable=yes,scrollbars=no,height=${popUpWindowHeight},width=${popUpWindowWidth},top=${top},left=${left}`
      )
    },
    async makeContribution({ retry = 0 } = {}) {
      try {
        this.isContributeBtnSnown = true
        this.loading = true
        this.status.msg = 'Downloading last contribution'
        this.status.type = ''
        let data = await fetch('api/challenge')
        data = new Uint8Array(await data.arrayBuffer())

        this.status.msg = 'Generating random contribution'
        await timeout(100) // allow UI to update before freezing in wasm
        console.log('Source params', data)
        const contribute = await this.$contribute()
        const result = contribute(data)
        console.log('Updated params', result)

        this.status.msg = 'Uploading and verifying your contribution'
        console.log('this.user.name', this.user)
        const formData = new FormData()
        formData.append('response', new Blob([result], { type: 'application/octet-stream' }))
        if (this.contributionType !== 'anonymous') {
          formData.append('name', this.user.name)
          formData.append('company', this.user.company)
        }
        const resp = await fetch('api/response', {
          method: 'POST',
          body: formData
        })
        if (resp.ok) {
          this.status.msg = 'Your contribution is verified and recorded. Thank you.'
          this.status.type = 'is-success'
          const responseData = await resp.json()
          this.contributionIndex = responseData.contributionIndex
        } else if (resp.status === 422) {
          if (retry < 3) {
            console.log(`Looks like someone else uploaded contribution ahead of us, retrying`)
            await this.makeContribution({ retry: retry++ })
          } else {
            this.status.msg = `Failed to upload your contribution after ${retry} attempts`
            this.status.type = 'is-danger'
            this.isContributeBtnSnown = false
          }
        } else {
          this.status.msg = 'Error uploading your contribution'
          this.status.type = 'is-danger'
          this.isContributeBtnSnown = false
        }
      } catch (e) {
        console.error(e.message)
        this.status.msg = e.message
        this.status.type = 'is-danger'
        this.isContributeBtnSnown = false
      } finally {
        this.loading = false
      }
    },
    logIn() {
      this.contributionType = 'twitter'
      window.location.replace('/api/connect')
    },
    onAnonymousHandler() {
      this.contributionType = 'anonymous'
      this.user = { name: '', handle: 'Anonymous', company: '' }
    }
  }
}
</script>
