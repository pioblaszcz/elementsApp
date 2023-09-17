<template>
  <div>
    <v-overlay :value="isLoading">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <div class="d-flex flex-wrap selectContainer">
      <v-autocomplete
        v-model="selectedServer"
        :items="servers"
        item-value="id"
        item-text="name"
        :label="$t('filterByServer')"
        class="filterInput mx-2"
        @input="(item) => filterTable(item, 'server')"
      ></v-autocomplete>
      <v-autocomplete
        v-model="selectedApp"
        :items="apps"
        item-value="id"
        item-text="name"
        :label="$t('filterByApp')"
        class="filterInput mx-2"
        @input="(item) => filterTable(item, 'app')"
      ></v-autocomplete>
    </div>
    <v-data-table
      v-if="tasks !== null"
      :headers="headersTask"
      :items="tasksCopy"
      :items-per-page="10"
      :custom-filter="customFilter"
      :search="search"
      class="tableEl rounded-lg"
      @click:row="handleShowTaskDetails"
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
      :apps="apps"
      :upgrade-fetch="fetchData"
    />
  </div>
</template>

<script>
export default {
  name: 'Tasks',
  data() {
    return {
      isLoading: false,
      search: '',
      tasks: null,
      tasksCopy: null,
      tasksFiltredBySerw: null,
      tasksFiltredByApp: null,
      servers: [],
      apps: [],
      clickedElement: {
        type: 'tasks',
        color: 'red',
      },
      showEdit: false,
      itemToEdit: {},
      selectedServer: null,
      selectedApp: null,
    }
  },
  computed: {
    headersTask: function () {
      return [
        {
          text: this.$t('tasks'),
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: this.$t('desc'), value: 'description' },
        { text: 'Id', value: 'id' },
        { text: this.$t('serverId'), value: 'server' },
        { text: this.$t('appId'), value: 'app' },
        { text: this.$t('date'), value: 'date' },
      ]
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    filterTable(item, type) {
      if (type === 'server') {
        this.tasksFiltredBySerw = this.tasks.filter((t) => t.serverId === item)
        if (item === null) {
          this.tasksFiltredBySerw = this.tasks
        }
      } else {
        this.tasksFiltredByApp = this.tasks.filter((t) => t.appId === item)
        if (item === null) {
          this.tasksFiltredByApp = this.tasks
        }
      }
      if (!this.tasksFiltredBySerw.length) {
        this.tasksCopy = []
        return
      }
      if (!this.tasksFiltredByApp) {
        this.tasksCopy = []
        return
      }

      this.tasksCopy =
        this.tasksFiltredByApp.length > this.tasksFiltredBySerw
          ? this.tasksFiltredByApp.filter((task) =>
              this.tasksFiltredBySerw.includes(task)
            )
          : this.tasksFiltredBySerw.filter((task) =>
              this.tasksFiltredByApp.includes(task)
            )
    },
    customFilter(value, search, item) {
      return item.name.toLowerCase().includes(search.toLowerCase())
    },
    handleShowTaskDetails(item) {
      this.showEdit = !this.showEdit
      this.itemToEdit = item
    },
    async fetchData() {
      this.isLoading = true
      const urls = [
        'http://localhost:3000/servers',
        'http://localhost:3000/apps',
        'http://localhost:3000/tasks',
      ]

      for (let url in urls) {
        url = urls[url]
        const res = await fetch(url)
        const data = await res.json()
        if (url.includes('servers')) {
          this.servers = data
        } else if (url.includes('apps')) {
          this.apps = data
          this.apps.forEach((app) => {
            const serverName = this.servers.filter((s) => s.id === app.serverId)
            app.server = `(${app.serverId}) ${serverName[0].name}`
          })
        } else {
          this.tasks = data
          this.tasksCopy = data
          this.tasksFiltredBySerw = data
          this.tasksFiltredByApp = data
          this.tasks.forEach((task) => {
            const serverName = this.servers.filter(
              (s) => s.id === task.serverId
            )
            const appName = this.apps.filter((a) => a.id === task.appId)
            task.server = `(${task.serverId}) ${serverName[0].name}`
            if (appName[0]) task.app = `(${task.appId}) ${appName[0].name}`
          })
        }
        this.isLoading = false
      }
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

.filterInput {
  flex-basis: 40%;
  min-width: 150px;
}

.selectContainer {
  width: 70%;
  margin: 0 auto;
}
</style>
