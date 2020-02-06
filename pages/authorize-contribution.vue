<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-spaced">
      Hello, <span>@{{ userHandle }}</span>
    </h1>
    <h2 class="subtitle">
      Lorem ipsum dolor sit amet, consectetur?
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
  },
  methods: {
    ...mapActions('user', ['getUserData'])
  }
}
</script>
