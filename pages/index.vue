<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-spaced">Tornado.cash <span>Trusted Setup Ceremony</span></h1>
    <p class="p is-size-6">
      zk-SNARKs require a pre-existing setup between the prover and verifier. A set of public
      parameters define the “rules of the game” for the construction of zk-SNARKs. Please contribute
      with your source of entropy, so that tornado.cash can be trustless.
    </p>
    <div class="buttons is-centered">
      <b-button type="is-primary" outlined tag="router-link" to="/make-contribution">
        Make the contribution
      </b-button>
    </div>
    <div class="currently">
      Currently there are <span>{{ contributions.length }}</span> contributions
    </div>

    <b-table
      :data="filteredContributions"
      :hoverable="true"
      :mobile-cards="false"
      :per-page="rowsPerPage"
      paginated
      pagination-position="both"
    >
      <template slot-scope="props">
        <b-table-column field="id" label="#" width="40" numeric>
          {{ props.row.id }}
        </b-table-column>

        <b-table-column label="Account">
          <a
            v-if="props.row.handle"
            :href="`https://${props.row.socialType}.com/${props.row.handle}`"
            class="social-link"
            target="_blank"
          >
            <span :class="`icon-${props.row.socialType}`" class="icon"></span>
            @{{ props.row.handle }}
          </a>
          <div v-else class="social-link">
            <span :class="`icon-${props.row.socialType}`" class="icon"></span>
            Anonymous
          </div>
        </b-table-column>

        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="company" label="Company">
          {{ props.row.company }}
        </b-table-column>

        <b-table-column :centered="true" label="Attestation">
          <a :href="props.row.attestation" target="_blank">{{ getAttestation(props.row) }}</a>
        </b-table-column>

        <b-table-column :centered="true" label="Contribution">
          <a :href="props.row.contribution" class="button is-icon">
            <Link />
          </a>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <span class="icon icon-emoticon-sad icon-48px"></span>
            </p>
            <p>Nothing here.</p>
          </div>
        </section>
      </template>

      <template slot="top-left">
        <b-field class="table-search">
          <b-input
            v-model="contributionSearch"
            placeholder="Search..."
            type="search"
            icon="magnify"
          ></b-input>
        </b-field>
      </template>

      <template slot="bottom-left">
        <b-field horizontal label="Show">
          <b-dropdown v-model="rowsPerPage" expanded aria-role="list" position="is-top-right">
            <div slot="trigger" class="control">
              <div class="input">
                <span>{{ rowsPerPage }}</span>
              </div>
            </div>
            <b-dropdown-item
              v-for="(rows, index) in [3, 10, 15, 20, 50]"
              :key="index"
              :value="rows"
              aria-role="listitem"
            >
              {{ rows }}
            </b-dropdown-item>
          </b-dropdown>
        </b-field>
      </template>
    </b-table>
  </div>
</template>

<script>
import Link from '@/components/icons/Link'

export default {
  components: {
    Link
  },
  data() {
    return {
      contributions: [],
      // contributions: [
      //   {
      //     id: 1,
      //     socialType: 'twitter',
      //     account: '@VitalikButerin',
      //     name: 'Vitalik Buterin',
      //     company: 'Ethereum',
      //     attestation: 'https://twitter.com/VitalikButerin/status/1220158987456237568',
      //     contribution: '#'
      //   }
      // ],
      rowsPerPage: 10,
      contributionSearch: ''
    }
  },
  computed: {
    filteredContributions() {
      return this.contributions.filter((contribution) => {
        const name = contribution.name || 'anonymous'
        return name.toLowerCase().includes(this.contributionSearch.toLowerCase())
      })
    }
  },
  async mounted() {
    try {
      const response = await fetch('/api/contributions')
      const data = await response.json()
      this.contributions = data
    } catch (e) {
      console.error('e', e)
    }
  },
  methods: {
    getAttestation(row) {
      const type = {
        twitter: 'Tweet',
        github: 'Gist',
        anonymous: ''
      }
      return type[row.socialType]
    }
  }
}
</script>
