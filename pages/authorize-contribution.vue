<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      Hello, <span>@{{ handle }}</span>
    </h1>
    <h2 class="subtitle">
      Do you want to authorize your contribution #{{ contributionIndex }}? Please sign in.
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
        Save information
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
    <div v-show="status.type === 'is-danger' || status.type === 'is-success'" class="status">
      <div :class="status.type" class="status-message">{{ status.msg }}</div>
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
      contributionIndex: 1,
      token: null,
      status: {
        type: '',
        msg: ''
      },
      hideSaveBtn: false
    }
  },
  computed: {
    ...mapState('user', ['name', 'handle', 'company']),
    ...mapGetters('user', ['isLoggedIn', 'hasErrorName'])
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
          this.status.msg = `Your contribution is verified and authorized. Thank you.`
          this.status.type = 'is-success'
          this.hideSaveBtn = true
        } else {
          const error = await response.text()
          this.status.msg = error
          this.status.type = 'is-danger'
        }
      } catch (e) {
        this.status.msg = 'Something went wrong. Please contact support'
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
          this.contributionIndex = id
        } else {
          const error = await response.text()
          this.status.msg = error
          this.status.type = 'is-danger'
          this.hideSaveBtn = true
        }
      } catch (e) {
        this.status.msg = 'Something went wrong. Please contact support'
        this.status.type = 'is-danger'
      }
    }
  }
}
</script>
