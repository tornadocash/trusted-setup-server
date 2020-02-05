<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-spaced">Lorem <span>Ipsum Dolor</span></h1>
    <p class="p is-size-5">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <div class="buttons is-centered">
      <b-button type="is-primary" outlined tag="router-link" to="/make-contribution">
        Make the contribution
      </b-button>
    </div>
    <div class="currently">Currently there are <span>8999</span> contributions</div>

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
          <a :href="`#${props.row.account}`" target="_blank">{{ props.row.account }}</a>
        </b-table-column>

        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="company" label="Company">
          {{ props.row.company }}
        </b-table-column>

        <b-table-column label="Attestation">
          <a :href="props.row.attestation" target="_blank">{{ props.row.account }}</a>
        </b-table-column>

        <b-table-column label="Contribution">
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
      contributions: [
        {
          id: 1,
          account: '@VitalikButerin',
          name: 'Vitalik Buterin',
          company: 'Ethereum',
          attestation: 'https://twitter.com/VitalikButerin/status/1220158987456237568',
          contribution: '#'
        },
        {
          id: 2,
          account: '@Chims1974',
          name: 'Rickey Kline',
          company: 'Big Wheel',
          attestation: '#',
          contribution: '#'
        },
        {
          id: 3,
          account: '@Diguest',
          name: 'Ryan Obrien',
          company: 'Brilliant Home',
          attestation: '#',
          contribution: '#'
        },
        {
          id: 4,
          account: '@Mathervenrat',
          name: 'William Hartwig',
          company: 'New World',
          attestation: '#',
          contribution: '#'
        },
        {
          id: 5,
          account: '@Hichercy',
          name: 'Wayne Biggins',
          company: 'Balanced Fortune',
          attestation: '#',
          contribution: '#'
        },
        {
          id: 6,
          account: '',
          name: 'Anonymous',
          company: '',
          attestation: '',
          contribution: '#'
        }
      ],
      rowsPerPage: 10,
      contributionSearch: ''
    }
  },
  computed: {
    filteredContributions() {
      return this.contributions.filter((contribution) => {
        return contribution.name.toLowerCase().includes(this.contributionSearch.toLowerCase())
      })
    }
  }
}
</script>
