<template>
  <div class="ceremony">
    <div class="title is-size-1 is-spaced">
      Hello, <span>@{{ user.handle }}</span>
    </div>
    <div class="subtitle">Lorem ipsum dolor sit amet, consectetur?</div>
    <p class="p">
      If you don’t trust binaries, we encorage you to follow this <a href="">instruction</a> to
      contribute by compiling from source code. It is very easy!
    </p>

    <div class="columns is-centered">
      <div class="column is-one-third">
        <div class="box">
          <div class="title is-5">Lorem ipsum</div>
          <Cloak />
        </div>
      </div>
      <div class="column is-one-third">
        <div :class="{ 'is-hovered': isLoggedIn }" class="box">
          <div class="title is-5">Lorem ipsum</div>
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
              Sign In
            </b-button>
          </div>
        </div>
      </div>
    </div>

    <div v-show="status.msg !== ''" class="status">
      <div :class="status.type" class="status-message">{{ status.msg }}</div>
      <div v-show="status.type === ''" class="status-spinner"></div>
    </div>

    <div class="buttons is-centered">
      <b-button
        v-if="!isContributeBtnDisabled"
        @click="makeContribution"
        type="is-primary"
        outlined
      >
        Make the contribution
      </b-button>
      <b-button
        v-if="isContributeBtnDisabled && status.type === 'is-success'"
        type="is-primary"
        outlined
      >
        Tweet about your contribution
      </b-button>
    </div>
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
      isContributeBtnDisabled: false,
      status: {
        type: '',
        msg: ''
      },
      user: { name: '', handle: 'Anonymous', company: '' }
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.user.name && this.user.name !== 'Anonymous'
    }
  },
  async mounted() {
    try {
      const data = await this.$axios.$get('/api/user_data')
      console.log('data', data)
      if (data.name !== 'Anonymous') {
        this.user.handle = data.handle
        this.user.name = data.name
      }
    } catch (e) {
      console.error('user_data fail', e)
    }
  },
  methods: {
    async makeContribution({ retry = 0 } = {}) {
      try {
        this.isContributeBtnDisabled = true

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
        formData.append('name', this.user.name)
        formData.append('company', this.user.company)
        const resp = await fetch('api/response', {
          method: 'POST',
          body: formData
        })

        if (resp.ok) {
          this.status.msg = 'Your contribution is verified and recorded. THX BYE.'
          this.status.type = 'is-success'
        } else if (resp.status === 422) {
          if (retry < 3) {
            console.log(`Looks like someone else uploaded contribution ahead of us, retrying`)
            await this.makeContribution({ retry: retry++ })
          } else {
            this.status.msg = `Failed to upload your contribution after ${retry} attempts`
            this.status.type = 'is-danger'
            this.isContributeBtnDisabled = false
          }
        } else {
          this.status.msg = 'Error uploading your contribution'
          this.status.type = 'is-danger'
          this.isContributeBtnDisabled = false
        }
      } catch (e) {
        console.error(e.message)
        this.status.msg = e.message
        this.status.type = 'is-danger'
        this.isContributeBtnDisabled = false
      }
    },
    logIn() {
      window.location.replace('/api/connect')
    }
  }
}
</script>
