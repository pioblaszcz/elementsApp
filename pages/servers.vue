<template>
  <div>
    <v-overlay :value="isLoading">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-data-table
      v-if="servers !== null"
      :headers="headersServ"
      :items="servers"
      :custom-filter="customFilter"
      :items-per-page="10"
      :search="search"
      class="tableEl rounded-lg"
      @click:row="handleShowServerDetails"
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
      :apps="appItems"
      :tasks="taskItems"
      :element="clickedElement"
      :upgrade-fetch="fetchData"
    />
  </div>
</template>

<script>
export default {
  name: 'Server',
  data() {
    return {
      isLoading: false,
      search: '',
      servers: null,
      showEdit: false,
      appItems: [],
      taskItems: [],
      clickedElement: {
        type: 'servers',
        color: 'primary',
      },
      itemToEdit: {},
    }
  },
  computed: {
    headersServ: function () {
      return [
        {
          text: this.$t('servers'),
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: this.$t('desc'), value: 'description' },
        { text: 'Id', value: 'id' },
        { text: this.$t('date'), value: 'date' },
      ]
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.isLoading = true
      fetch('http://localhost:3000/servers')
        .then((response) => response.json())
        .then((resp) => {
          this.servers = resp
          this.isLoading = false
        })
      fetch('http://localhost:3000/apps')
        .then((response) => response.json())
        .then((resp) => {
          this.appItems = resp
        })
      fetch('http://localhost:3000/tasks')
        .then((response) => response.json())
        .then((resp) => {
          this.taskItems = resp
        })
    },
    handleShowServerDetails(item) {
      this.showEdit = !this.showEdit
      this.itemToEdit = item
    },
    customFilter(value, search, item) {
      return item.name.toLowerCase().includes(search.toLowerCase())
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
</style>
