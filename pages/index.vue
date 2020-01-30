<template>
  <div class="ceremony">
    <div class="title is-size-1 is-spaced">Hello, <span>Anonymous</span></div>
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
              <b-input value="Vitalik Buterin"></b-input>
            </b-field>
            <b-field label="Company">
              <b-input value="Ethereum"></b-input>
            </b-field>
          </div>
          <div v-else class="buttons">
            <b-button @click="isLoggedIn = true" type="is-primary" outlined expanded>
              Sign In
            </b-button>
          </div>
        </div>
      </div>
    </div>

    <div class="buttons is-centered">
      <b-button
        :loading="isContributeBtnDisabled"
        @click="makeContribution"
        type="is-primary"
        outlined
        >Make the contribution</b-button
      >
    </div>

    <div v-show="status" class="status">
      <div class="status-message">{{ status }}</div>
      <div class="status-spinner"></div>
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
      status: '',
      isLoggedIn: false
    }
  },
  methods: {
    async makeContribution({ retry = 0 } = {}) {
      try {
        this.isContributeBtnDisabled = true

        this.status = 'Downloading last contribution'
        let data = await fetch('api/challenge')
        data = new Uint8Array(await data.arrayBuffer())

        this.status = 'Generating random contribution'
        await timeout(100) // allow UI to update before freezing in wasm
        console.log('Source params', data)
        const contribute = await this.$contribute()
        const result = contribute(data)
        console.log('Updated params', result)

        this.status = 'Uploading and verifying your contribution'
        const formData = new FormData()
        formData.append('response', new Blob([result], { type: 'application/octet-stream' }))
        formData.append('name', 'William') // TODO put real name here
        formData.append('company', 'Microsoft')
        const resp = await fetch('api/response', {
          method: 'POST',
          body: formData
        })

        if (resp.ok) {
          this.status = 'Your contribution is verified and recorded. THX BYE.'
        } else if (resp.status === 422) {
          if (retry < 3) {
            console.log(`Looks like someone else uploaded contribution ahead of us, retrying`)
            await this.makeContribution({ retry: retry++ })
          } else {
            this.status = `Failed to upload your contribution after ${retry} attempts`
          }
        } else {
          this.status = 'Error uploading your contribution'
        }
      } finally {
        this.isContributeBtnDisabled = false
      }
    }
  }
}
</script>
