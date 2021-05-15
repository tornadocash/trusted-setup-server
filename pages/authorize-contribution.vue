<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      Hello, <span>@{{ handle }}</span>
    </h1>
    <h2 class="subtitle">
      {{ title }}
    </h2>
    <fieldset :disabled="hideSaveBtn" class="authorize">
      <Form />
    </fieldset>
    <div class="buttons is-centered">
      <b-button
        v-if="isLoggedIn && !hideSaveBtn"
        @click="authorize"
        :disabled="hasErrorName.invalid"
        type="is-primary"
        outlined
      >
        {{ $t('pages.index.saveInformation') }}
      </b-button>
    </div>
    <div v-show="status.type !== ''" class="status">
      <div :class="status.type" class="status-message">{{ status.msg }}</div>
      <div v-show="status.type === 'is-success'" class="status-message is-success">
        {{ $t('pages.index.postAttestationTwitter') }}
        <div class="buttons is-centered">
          <b-button @click="makeTweet" type="is-primary" tag="a" target="_blank" outlined>
            {{ $t('pages.index.postAttestation') }}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import Form from '@/components/Form'

export default {
  components: {
    Form
  },
  data() {
    return {
      token: null,
      status: {
        type: '',
        msg: ''
      },
      hideSaveBtn: false
    }
  },
  computed: {
    ...mapState('user', ['name', 'handle', 'company', 'contributionIndex']),
    ...mapGetters('user', ['isLoggedIn', 'hasErrorName']),
    title() {
      if (this.status.type === 'is-danger' || !this.contributionIndex) {
        return null
      }
      if (!this.isLoggedIn) {
        return this.$t('pages.authorize.contributeIdentity') + `#${this.contributionIndex}?`
      } else {
        return this.$t('pages.authorize.specifyName')
      }
    }
  },
  async mounted() {
    this.$root.$emit('enableLoading')
    await this.getUserData()
    this.token = this.$route.query.token
    if (!this.token) {
      window.location.replace(window.location.origin)
    } else {
      await this.getContributionIndex()
    }
    setTimeout(() => {
      this.$root.$emit('disableLoading')
    }, 800)
  },
  methods: {
    ...mapActions('user', ['getUserData', 'makeTweet']),
    async authorize() {
      const body = {
        token: this.token,
        name: this.name,
        company: this.company
      }
      try {
        const response = await fetch('/api/authorize_contribution', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        if (response.ok) {
          this.status.msg = this.$t('pages.authorize.contributionUpdated')
          this.status.type = 'is-success'
          this.hideSaveBtn = true
        } else {
          const error = await response.text()
          this.status.msg = error
          this.status.type = 'is-danger'
        }
      } catch (e) {
        this.status.msg = this.$t('pages.authorize.somethingWrong')
        this.status.type = 'is-danger'
      }
    },
    async getContributionIndex() {
      const body = {
        token: this.token
      }
      try {
        const response = await fetch('/api/get_contribution_index', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        if (response.ok) {
          const { id } = await response.json()
          this.$store.commit('user/SET_CONTRIBUTION_INDEX', id)
        } else {
          const error = await response.text()
          this.status.msg = error
          this.status.type = 'is-danger'
          this.hideSaveBtn = true
        }
      } catch (e) {
        this.status.msg = this.$t('pages.authorize.somethingWrong')
        this.status.type = 'is-danger'
      }
    }
  }
}
</script>
