<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      {{ $t('pages.contribution.hello') }} <span>@{{ userHandle }}</span>
    </h1>
    <h2 class="subtitle">
      {{ $t('pages.contribution.contributeHow') }}
    </h2>
    <fieldset :disabled="status.type === 'is-success'">
      <div class="columns is-centered">
        <div class="column is-one-third">
          <button
            :class="{ 'is-hovered': contributionType === 'anonymous' }"
            @click="onAnonymousHandler"
            class="box box-anonymous"
          >
            <div class="title is-5">{{ $t('pages.contribution.anonymously') }}</div>
            <Cloak />
          </button>
        </div>
        <div class="column is-one-third">
          <div :class="{ 'is-hovered': isLoggedIn }" class="box">
            <div class="title is-5">{{ $t('pages.contribution.socialAccount') }}</div>
            <Form />
          </div>
        </div>
      </div>
    </fieldset>

    <div v-show="contributionHash" class="status">
      <div class="label">{{ $t('pages.contribution.contributionHash') }}</div>
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
        {{ $t('pages.contribution.postAttestationTwitter') }}
        <div class="buttons is-centered">
          <b-button @click="makeTweet" type="is-primary" tag="a" target="_blank" outlined>
            {{ $t('pages.contribution.postAttestation') }}
          </b-button>
        </div>
      </div>
    </div>
    <div v-show="authorizeLink" class="status">
      {{ $t('pages.contribution.provideIdentity') }}
      <a :href="authorizeLink">{{ $t('pages.contribution.thisLink') }}</a
      >.
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
      {{ $t('pages.contribution.trustBinaries') }}
      <router-link to="/instructions">{{ $t('pages.contribution.instructions') }}</router-link>
      {{ $t('pages.contribution.easyCompile') }}
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
    ...mapGetters('user', ['isLoggedIn', 'hasErrorWallet', 'hasErrorName']),
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
    userWallet: {
      get() {
        return this.$store.state.user.wallet
      },
      set(value) {
        this.$store.commit('user/SET_WALLET', value)
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
        this.hasErrorName.invalid ||
        this.hasErrorWallet.invalid
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
        title: this.$t('pages.contribution.contribution'),
        message: this.$t('pages.contribution.provideRandom'),
        inputAttrs: {
          maxlength: 300
        },
        confirmText: this.$t('pages.contribution.contribute'),
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
        this.$root.$emit('enableLoading', this.$t('pages.contribution.downloadingLast'))
        let data = await fetch('api/challenge')
        data = new Uint8Array(await data.arrayBuffer())

        this.$root.$emit('enableLoading', this.$t('pages.contribution.generatingRandom'))
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

        this.$root.$emit('enableLoading', this.$t('pages.contribution.uploadingContribution'))
        const formData = new FormData()
        formData.append('response', new Blob([contribution], { type: 'application/octet-stream' }))
        if (this.contributionType !== 'anonymous') {
          formData.append('name', this.userName)
          formData.append('company', this.userCompany)
          formData.append('wallet', this.userWallet)
        }
        const resp = await fetch('api/response', {
          method: 'POST',
          body: formData
        })
        if (resp.ok) {
          const responseData = await resp.json()
          this.$store.commit('user/SET_CONTRIBUTION_INDEX', responseData.contributionIndex)
          this.status.msg = this.$t('pages.contribution.contributionVerified')
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
            this.status.msg =
              this.$t('pages.contribution.failedUpload') +
              retry +
              this.$t('pages.contribution.attempts')
            this.status.type = 'is-danger'
            this.isContributeBtnSnown = false
          }
        } else {
          this.status.msg = this.$t('pages.contribution.uploadError')
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
          message: this.$t('pages.contribution.copied'),
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
