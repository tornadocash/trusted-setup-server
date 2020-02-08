<template>
  <div class="form">
    <div v-if="isLoggedIn" class="fields">
      <button @click="logOut" class="button is-icon logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="#94febf"
            d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"
          />
        </svg>
      </button>
      <b-field
        :type="{ 'is-danger': hasErrorName.invalid }"
        :message="{ [hasErrorName.msg]: hasErrorName.invalid }"
        label="Name"
      >
        <b-input v-model="userName" maxlength="35"></b-input>
      </b-field>
      <b-field label="Company">
        <b-input v-model="userCompany" maxlength="35"></b-input>
      </b-field>
    </div>
    <div v-else class="buttons">
      <b-button @click="logInVia('twitter')" type="is-primary" outlined expanded>
        Sign in with Twitter
      </b-button>
      <b-button @click="logInVia('github')" type="is-primary" outlined expanded>
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
    ...mapActions('user', ['makeTweet', 'logInVia', 'logOut'])
  }
}
</script>
