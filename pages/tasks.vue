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
      label="Filtruj po serwerze"
      class="filtrByServerInput"
      @input="(item) => filterTable(item, 'server')"
    ></v-autocomplete>
    <v-autocomplete
      v-model="selectedApp"
      :items="apps"
      item-value="id"
      item-text="name"
      label="Filtruj po aplikacji"
      class="filtrByServerInput"
      @input="(item) => filterTable(item, 'app')"
    ></v-autocomplete>
    <v-data-table
      v-if="tasks !== null"
      :headers="headerTasks"
      :items="tasksCopy"
      :items-per-page="10"
      :search="search"
      class="tableEl rounded-lg"
      @click:row="handleShowTaskDetails"
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Szukaj po nazwie"
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
      headerTasks: [
        {
          text: 'Taski',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: 'Opis', value: 'description' },
        { text: 'Id', value: 'id' },
        { text: 'Id serwera', value: 'serverId' },
        { text: 'Id aplikacji', value: 'appId' },
        { text: 'Data modyfikacji', value: 'date' },
      ],
    }
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
    fetchData() {
      this.selectedApp = null
      this.selectedServer = null
      this.isLoading = true
      fetch('http://localhost:3000/tasks')
        .then((response) => response.json())
        .then((resp) => {
          this.tasks = resp
          this.tasksCopy = resp
          this.tasksFiltredBySerw = resp
          this.tasksFiltredByApp = resp
          this.isLoading = false
        })
      fetch('http://localhost:3000/servers')
        .then((response) => response.json())
        .then((resp) => {
          this.servers = resp
        })
      fetch('http://localhost:3000/apps')
        .then((response) => response.json())
        .then((resp) => {
          this.apps = resp
        })
    },
    handleShowTaskDetails(item) {
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
