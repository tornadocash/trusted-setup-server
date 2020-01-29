<template>
  <div class="has-text-centered">
    <div class="title is-size-1">Hello, Anonymous</div>
    <div class="buttons is-centered">
      <b-button
        :loading="isContributeBtnDisabled"
        @click="makeContribution"
        type="is-primary"
        outlined
        >Make the contribution</b-button
      >
      <b-button type="is-primary" outlined>Sign In</b-button>
    </div>
    {{ status }}
  </div>
</template>

<script>
/* eslint-disable no-console */

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default {
  data() {
    return {
      isContributeBtnDisabled: false,
      status: ''
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
