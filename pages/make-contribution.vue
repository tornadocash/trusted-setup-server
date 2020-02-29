<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      Hello, <span>@{{ userHandle }}</span>
    </h1>
    <h2 class="subtitle">
      What way do you want to contribute to the Tornado.cash Trusted Setup Ceremony?
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
            <div class="title is-5">Using a social account</div>
            <Form />
          </div>
        </div>
      </div>
    </fieldset>

    <div v-show="status.type === 'is-danger' || status.type === 'is-success'" class="status">
      <div :class="status.type" class="status-message">{{ status.msg }}</div>
    </div>
    <div v-show="contributionHash" class="is-success status-message">
      Your contribution hash (Blake2b) is {{ contributionHash }}
    </div>
    <div v-show="authorizeLink" class="is-success status-message">
      You still can authorize your contribution by following this <a :href="authorizeLink">link.</a>
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
        v-if="status.type === 'is-success' && contributionType !== 'anonymous'"
        @click="makeTweet"
        type="is-primary"
        tag="a"
        target="_blank"
        outlined
      >
        Post attestation
      </b-button>
    </div>
    <p class="p">
      If you don’t trust binaries, we encorage you to follow this <a href="">instruction</a> to
      contribute by compiling from source code. It is very easy!
    </p>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapGetters, mapActions } from 'vuex'
import Cloak from '@/components/Cloak'
import Form from '@/components/Form'
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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
    async makeContribution({ retry = 0 } = {}) {
      try {
        this.isContributeBtnSnown = true
        this.status.msg = ''
        this.status.type = ''
        this.$root.$emit('enableLoading', 'Downloading last contribution')
        let data = await fetch('api/challenge')
        data = new Uint8Array(await data.arrayBuffer())

        this.$root.$emit('enableLoading', 'Generating random contribution')
        await timeout(100) // allow UI to update before freezing in wasm
        console.log('Source params', data)
        const contribute = await this.$contribute()
        const result = contribute(data)
        console.log('Updated params', result)

        this.$root.$emit('enableLoading', 'Uploading and verifying your contribution')
        console.log('this.user.name', this.userName, this.userHandle, this.userCompany)
        const formData = new FormData()
        formData.append('response', new Blob([result], { type: 'application/octet-stream' }))
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
          this.status.msg = 'Your contribution is verified and recorded.'
          this.status.type = 'is-success'
          this.contributionHash = responseData.hash
          if (this.contributionType === 'anonymous') {
            this.authorizeLink = `${window.location.origin}/authorize-contribution?token=${responseData.token}`
          } else {
            this.status.msg += ' Now you can post attestation from your twitter account.'
          }
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
        this.$root.$emit('disableLoading')
      }
    },
    onAnonymousHandler() {
      this.logOut()
      this.contributionType = 'anonymous'
    }
  }
}
</script>
