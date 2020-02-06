<template>
  <div class="form">
    <div v-if="isLoggedIn" class="fields">
      <b-field
        :type="{ 'is-danger': hasErrorName.invalid }"
        :message="{ [hasErrorName.msg]: hasErrorName.invalid }"
        label="Name"
      >
        <b-input v-model="userName" maxlength="35"></b-input>
      </b-field>
      <b-field label="Company">
        <b-input v-model="userCompany"></b-input>
      </b-field>
    </div>
    <div v-else class="buttons">
      <b-button @click="twitterLogIn" type="is-primary" outlined expanded>
        Sign in with Twitter
      </b-button>
      <b-button :disabled="true" type="is-primary" outlined expanded>
        Sign in with Github
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      nameErrorMessage: ''
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
    userCompany: {
      get() {
        return this.$store.state.user.company
      },
      set(value) {
        this.$store.commit('user/SET_COMPANY', value)
      }
    }
  },
  methods: {
    ...mapActions('user', ['makeTweet', 'twitterLogIn'])
  }
}
</script>
