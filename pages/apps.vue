<template>
  <div>
    <v-overlay :value="isLoading">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-autocomplete
      v-model="selectedServer"
      :items="servers"
      item-value="id"
      item-text="name"
      :label="$t('filterByServer')"
      class="filtrByServerInput"
      @input="filterByServer"
    ></v-autocomplete>
    <v-data-table
      v-if="apps !== null"
      :headers="headersApp"
      :items="appsCopy"
      :items-per-page="10"
      :search="search"
      class="tableEl rounded-lg"
      @click:row="handleShowAppDetails"
    >
      <template #top>
        <v-text-field
          v-model="search"
          :label="$t('searchByName')"
          class="mx-4"
        ></v-text-field>
      </template>
    </v-data-table>
    <edit-component
      v-model="showEdit"
      :item="itemToEdit"
      :element="clickedElement"
      :servers="servers"
      :upgrade-fetch="fetchData"
    />
  </div>
</template>

<script>
export default {
  name: 'Apps',
  data() {
    return {
      isLoading: false,
      search: '',
      servers: null,
      apps: null,
      appsCopy: null,
      showEdit: false,
      selectedServer: null,
      clickedElement: {
        type: 'apps',
        color: 'green',
      },
      itemToEdit: {},
    }
  },
  computed: {
    headersApp: function () {
      return [
        {
          text: this.$t('apps'),
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: this.$t('desc'), value: 'description' },
        { text: 'Id', value: 'id' },
        { text: this.$t('serverId'), value: 'serverId' },
        { text: this.$t('date'), value: 'date' },
      ]
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    filterByServer(item) {
      this.appsCopy = this.apps.filter((a) => a.serverId === item)
      if (item === null) {
        this.appsCopy = this.apps
      }
    },

    fetchData() {
      this.isLoading = true
      this.selectedServer = null
      fetch('http://localhost:3000/apps')
        .then((response) => response.json())
        .then((resp) => {
          this.apps = resp
          this.appsCopy = resp
          this.isLoading = false
        })
      fetch('http://localhost:3000/servers')
        .then((response) => response.json())
        .then((resp) => (this.servers = resp))
    },

    handleShowAppDetails(item) {
      this.showEdit = !this.showEdit
      this.itemToEdit = item
    },
  },
}
</script>

<style scoped>
.tableEl {
  width: 80%;
  margin: 0 auto;
  box-shadow: 0 0 5px rgb(204, 204, 204);
}
.tableEl >>> tbody tr :hover {
  cursor: pointer;
}

.filtrByServerInput {
  width: 60%;
  margin: 0 auto;
}
</style>
