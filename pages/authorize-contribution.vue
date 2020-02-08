<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      Hello, <span>@{{ userHandle }}</span>
    </h1>
    <h2 class="subtitle">
      Do you want to authorize your contribution #{{ contributionIndex }}? Please sign in.
    </h2>
    <fieldset class="authorize">
      <Form />
    </fieldset>
    <div class="buttons is-centered">
      <b-button v-if="isLoggedIn" :disabled="hasErrorName.invalid" type="is-primary" outlined>
        Save information
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Form from '@/components/Form'

export default {
  components: {
    Form
  },
  data() {
    return {
      contributionIndex: 1
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'hasErrorName']),
    userHandle: {
      get() {
        return this.$store.state.user.handle
      }
    }
  },
  async mounted() {
    await this.getUserData()
    // TODO. parse href to take token (it's supposed to be after #)
    // then you need to store it in localstorage OR pass to server (to `/connect`) so after the authorization redirect server can put it in url
  },
  methods: {
    ...mapActions('user', ['getUserData'])
  }
}
</script>
