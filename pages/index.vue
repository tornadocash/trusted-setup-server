<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      Tornado.cash <span>Trusted Setup Ceremony</span>
    </h1>
    <h2 class="title">
      The Ceremony is completed. Thank you for your participation!
    </h2>
    <div class="currently">
      There were <span>{{ contributions.length }}</span> contributions
    </div>
    <div class="buttons is-centered">
      <a
        class="button is-primary is-outlined"
        href="https://tornado-cash-ceremony.s3-us-west-2.amazonaws.com/phase2.tar.gz"
      >
        Download ceremony archive (10 Gb)
      </a>
    </div>

    <b-table
      :data="filteredContributions"
      :hoverable="true"
      :mobile-cards="false"
      :per-page="rowsPerPage"
      paginated
      pagination-position="both"
      default-sort="followersCount"
      default-sort-direction="desc"
    >
      <template slot-scope="props">
        <b-table-column field="id" label="#" width="40" sortable numeric>
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

        <b-table-column :centered="true" field="followersCount" label="Followers" sortable>
          {{ props.row.followersCount > 0 ? numberFormater(props.row.followersCount) : '' }}
        </b-table-column>

        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="company" label="Project">
          {{ props.row.company }}
        </b-table-column>

        <b-table-column :centered="true" label="Attestation">
          <!-- :href="`https://twitter.com/${props.row.handle}/status/${props.row.attestation}`" -->
          <a
            v-if="props.row.attestation"
            :href="props.row.attestation"
            target="_blank"
            class="button is-icon"
          >
            <span class="icon icon-link"></span>
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
              v-for="(rows, index) in [10, 25, 50, 100, 1000]"
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
import contributions from '@/store/contributions'

export default {
  data() {
    return {
      contributions,
      // contributions: [],
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
      rowsPerPage: 100,
      contributionSearch: '',
      downloadUrl: process.env.downloadUrl
    }
  },
  computed: {
    filteredContributions() {
      return this.contributions.filter((contribution) => {
        const name = contribution.name || 'anonymous'
        const company = contribution.company ?? ''
        return (
          name.toLowerCase().includes(this.contributionSearch.toLowerCase()) ||
          company.toLowerCase().includes(this.contributionSearch.toLowerCase())
        )
      })
    }
  },
  methods: {
    numberFormater(num) {
      return num > 999 ? ~~(num / 1000) + 'k' : num
    }
  }
  // async mounted() {
  //   try {
  //     const response = await fetch('/api/contributions')
  //     const data = await response.json()
  //     this.contributions = data
  //   } catch (e) {
  //     console.error('e', e)
  //   }
  // }
}
</script>
