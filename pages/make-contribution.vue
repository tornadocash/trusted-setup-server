<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      Hello, <span>@{{ userHandle }}</span>
    </h1>
    <h2 class="subtitle">
      How would you like to contribute to the Tornado.cash Trusted Setup Ceremony?
    </h2>
    <fieldset :disabled="status.type === 'is-success'">
      <div class="columns is-centered">
        <div class="column is-one-third">
          <button
            :class="{ 'is-hovered': contributionType === 'anonymous' }"
            @click="onAnonymousHandler"
            class="box box-anonymous"
          >
            <div class="title is-5">Anonymously</div>
            <Cloak />
          </button>
        </div>
        <div class="column is-one-third">
          <div :class="{ 'is-hovered': isLoggedIn }" class="box">
            <div class="title is-5">By using social account</div>
            <Form />
          </div>
        </div>
      </div>
    </fieldset>

    <div v-show="contributionHash" class="status">
      <div class="label">Your contribution hash (Blake2b)</div>
      <b-field position="is-centered" class="has-addons contribution-hash">
        <b-input
          @click.native="copyContributionHash"
          :value="contributionHash"
          icon="copy"
          readonly
        ></b-input>
      </b-field>
    </div>
    <div v-show="status.type !== ''" class="status">
      <div :class="status.type" class="status-message">{{ status.msg }}</div>
      <div
        v-show="status.type === 'is-success' && contributionType !== 'anonymous'"
        class="status-message is-success"
      >
        And now you can post your attestation to Twitter.
        <div class="buttons is-centered">
          <b-button @click="makeTweet" type="is-primary" tag="a" target="_blank" outlined>
            Post attestation
          </b-button>
        </div>
      </div>
    </div>
    <div v-show="authorizeLink" class="status">
      You can still provide identity for your contribution by following
      <a :href="authorizeLink" class="has-text-primary">this link</a>.
    </div>

    <div class="buttons is-centered">
      <b-button
        v-if="!isContributeBtnSnown"
        @click="getUserRandom"
        :disabled="isContributeBtnDisabled"
        type="is-primary"
        outlined
      >
        Contribute
      </b-button>
    </div>
    <p class="p">
      If you don’t trust binaries, we encorage you to follow these
      <router-link to="/instructions">instructions</router-link> to contribute by compiling from the
      source code. It is fairly easy!
    </p>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapGetters, mapActions } from 'vuex'
import Cloak from '@/components/Cloak'
import Form from '@/components/Form'
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function buf2hex(buffer) {
  // buffer is an ArrayBuffer
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
    .join('')
}

export default {
  components: {
    Cloak,
    Form
  },
  data() {
    return {
      isContributeBtnSnown: false,
      status: {
        type: '',
        msg: ''
      },
      contributionHash: null,
      authorizeLink: null
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'hasErrorName']),
    userName: {
      get() {
        return this.$store.state.user.name
      },
      set(value) {
        this.$store.commit('user/SET_NAME', value)
      }
    },
    userHandle: {
      get() {
        return this.$store.state.user.handle
      },
      set(value) {
        this.$store.commit('user/SET_HANDLE', value)
      }
    },
    userCompany: {
      get() {
        return this.$store.state.user.company
      },
      set(value) {
        this.$store.commit('user/SET_COMPANY', value)
      }
    },
    contributionType: {
      get() {
        return this.$store.state.user.contributionType
      },
      set(value) {
        this.$store.commit('user/SET_CONTRIBUTION_TYPE', value)
      }
    },
    isContributeBtnDisabled() {
      return (
        !this.contributionType ||
        (!this.isLoggedIn && this.contributionType !== 'anonymous') ||
        this.hasErrorName.invalid
      )
    }
  },
  async mounted() {
    this.$root.$emit('enableLoading')
    await this.getUserData()
    setTimeout(() => {
      this.$root.$emit('disableLoading')
    }, 800)
  },
  methods: {
    ...mapActions('user', ['makeTweet', 'logOut', 'getUserData']),
    getUserRandom() {
      this.$buefy.dialog.prompt({
        title: 'Contribution',
        message: `Please provide your random input that will be used as a source of entropy for your contribution along with browser's RNG.`,
        inputAttrs: {
          maxlength: 300
        },
        confirmText: 'Contribute',
        trapFocus: true,
        onConfirm: (userInput) => {
          this.makeContribution({ userInput })
        }
      })
    },
    async makeContribution({ userInput, retry = 0 } = {}) {
      try {
        const contribute = await this.$contribute()
        this.isContributeBtnSnown = true
        this.status.msg = ''
        this.status.type = ''
        this.$root.$emit('enableLoading', 'Downloading last contribution')
        let data = await fetch('api/challenge')
        data = new Uint8Array(await data.arrayBuffer())

        this.$root.$emit(
          'enableLoading',
          'Generating random contribution. Your browser may appear unresponsive. It can take a minute or so to complete'
        )
        await timeout(100) // allow UI to update before freezing in wasm
        console.log('Source params', data)

        const msgBuffer = new TextEncoder('utf-8').encode(userInput)
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer)
        const entropyFromUser = new Uint8Array(hashBuffer)
        // console.log('entropyFromUser', entropyFromUser.toString())

        const entropyFromBrowser = window.crypto.getRandomValues(new Uint8Array(32))
        // console.log('entropyFromBrowser', entropyFromBrowser.toString())

        // suffle the browser and user random
        const entropy = new Uint8Array(entropyFromBrowser.length)
        for (let i = 0; i < entropyFromBrowser.length; i++) {
          entropy[i] = entropyFromBrowser[i] + entropyFromUser[i]
        }

        // console.log('entropy', entropy)
        await this.sleep(100) // so browser can render the messages
        const result = contribute(data, entropy)
        console.log('Updated params', result)
        const hash = '0x' + buf2hex(result.slice(0, 64))
        const contribution = result.slice(64)

        console.log('hash', hash)
        console.log('contribution', contribution)

        this.$root.$emit('enableLoading', 'Uploading and verifying your contribution')
        const formData = new FormData()
        formData.append('response', new Blob([contribution], { type: 'application/octet-stream' }))
        if (this.contributionType !== 'anonymous') {
          formData.append('name', this.userName)
          formData.append('company', this.userCompany)
        }
        const resp = await fetch('api/response', {
          method: 'POST',
          body: formData
        })
        if (resp.ok) {
          const responseData = await resp.json()
          this.$store.commit('user/SET_CONTRIBUTION_INDEX', responseData.contributionIndex)
          this.status.msg = 'Your contribution has been verified and recorded.'
          this.status.type = 'is-success'
          this.contributionHash = hash
          if (this.contributionType === 'anonymous') {
            this.authorizeLink = `${window.location.origin}/authorize-contribution?token=${responseData.token}`
          }
        } else if (resp.status === 422) {
          if (retry < 3) {
            console.log(`Looks like someone else uploaded contribution ahead of us, retrying`)
            await this.makeContribution({ userInput, retry: retry++ })
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
        console.error(e)
        this.status.msg = e.message
        this.status.type = 'is-danger'
        this.isContributeBtnSnown = false
      } finally {
        this.$root.$emit('disableLoading')
      }
    },
    onAnonymousHandler() {
      this.logOut()
      this.contributionType = 'anonymous'
    },
    copyContributionHash() {
      navigator.clipboard.writeText(this.contributionHash).then(() => {
        this.$buefy.toast.open({
          message: 'Copied!',
          type: 'is-primary'
        })
      })
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }
  }
}
</script>
