<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      {{ $t('pages.index.sherpaCash') }}
      <span>{{ $t('pages.index.trustedSetupCeremonyTitle') }}</span>
    </h1>
    <p class="p is-size-6">
      {{ $t('pages.index.zkSnarks') }}
    </p>
    <div class="buttons is-centered">
      <b-button type="is-primary" outlined tag="router-link" to="/make-contribution">
        {{ $t('pages.index.contribute') }}
      </b-button>
    </div>
    <div class="summary">
      <div class="currently">
        {{ $t('pages.index.currently') }} <span>{{ contributions.length }}</span>
        {{ $t('pages.index.contributions') }}
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

          <b-table-column :label="$t('pages.index.account')">
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

          <b-table-column :label="$t('pages.index.name')" field="name">
            {{ props.row.name }}
          </b-table-column>

          <b-table-column :label="$t('pages.index.project')" field="company">
            {{ props.row.company }}
          </b-table-column>

          <b-table-column :centered="true" :label="$t('pages.index.attestation')">
            <a
              v-if="props.row.attestation"
              :href="`https://twitter.com/${props.row.handle}/status/${props.row.attestation}`"
              target="_blank"
              class="button is-icon"
            >
              <span class="icon icon-link"></span>
            </a>
          </b-table-column>

          <b-table-column>
            <a :href="`${downloadUrl}/response_${props.row.id}`" class="button is-icon" download>
              <span class="icon icon-save"></span>
            </a>
          </b-table-column>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <span class="icon icon-emoticon-sad icon-48px"></span>
              </p>
              <p>{{ $t('pages.index.nothingHere') }}</p>
            </div>
          </section>
        </template>

        <template slot="top-left">
          <b-field class="table-search">
            <b-input
              v-model="contributionSearch"
              :placeholder="$t('pages.index.search')"
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
  </div>
</template>

<script>
export default {
  data() {
    /*    const contributor = {
      id: 1,
      socialType: 'twitter',
      account: '@VitalikButerin',
      name: 'Vitalik Buterin',
      company: 'Ethereum',
      attestation: 'https://twitter.com/VitalikButerin/status/1220158987456237568',
      contribution: '#'
    } */
    return {
      contributions: [],
      // contributions: [...Array(20).keys()].map((i) => contributor),
      rowsPerPage: 100,
      contributionSearch: '',
      downloadUrl: process.env.downloadUrl
    }
  },
  computed: {
    filteredContributions() {
      return this.contributions
        .filter((contribution) => {
          const name = contribution.name || 'anonymous'
          return name.toLowerCase().includes(this.contributionSearch.toLowerCase())
        })
        .reverse()
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
  }
}
</script>
