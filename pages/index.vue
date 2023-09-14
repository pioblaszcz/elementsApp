<template>
  <v-row>
    <v-col
      cols="2.5"
      class="mt-7 mr-2 d-flex rounded-lg flex-column align-center button-container"
    >
      <v-btn
        color="primary"
        class="button-add"
        elevation="2"
        x-large
        @click="handleAdd('server')"
        >{{ $t('addServer__btn') }}</v-btn
      >
      <v-btn
        color="green"
        class="button-add mt-4 mb-4"
        elevation="2"
        x-large
        @click="handleAdd('app')"
        >{{ $t('addApp__btn') }}</v-btn
      >
      <v-btn
        color="red"
        class="button-add"
        elevation="2"
        x-large
        @click="handleAdd('task')"
        >{{ $t('addTask__btn') }}</v-btn
      >
    </v-col>
    <v-col cols="9" class="mt-4">
      <v-skeleton-loader
        v-if="isLoading"
        class="mx-auto border"
        max-width="80%"
        max-height="25vh"
        type="table"
      ></v-skeleton-loader>
      <v-skeleton-loader
        v-if="isLoading"
        class="mx-auto border my-5"
        max-width="80%"
        max-height="25vh"
        type="table"
      ></v-skeleton-loader>
      <v-skeleton-loader
        v-if="isLoading"
        class="mx-auto border"
        max-width="80%"
        max-height="25vh"
        type="table"
      ></v-skeleton-loader>
      <v-data-table
        v-if="servers !== null && !isLoading"
        :headers="headersServ"
        :items="servers"
        :items-per-page="5"
        class="tableEl rounded-lg"
        @click:row="handleShowDetails"
      >
      </v-data-table>
      <v-data-table
        v-if="apps !== null && !isLoading"
        :headers="headersApp"
        :items="apps"
        :items-per-page="5"
        class="tableEl mb-6 mt-6 rounded-lg"
        @click:row="handleShowDetails"
      ></v-data-table>

      <v-data-table
        v-if="tasks !== null && !isLoading"
        :headers="headersTask"
        :items="tasks"
        :items-per-page="5"
        class="tableEl mb-6 mt-6 rounded-lg"
        @click:row="handleShowDetails"
      ></v-data-table>
    </v-col>
    <dialog-component
      v-model="showDialog"
      :element="clickedElement"
      :servers="servers"
      :apps="apps"
      :upgrade-fetch="fetchData"
    />
    <edit-component
      v-model="showEdit"
      :item="itemToEdit"
      :element="clickedElement"
      :servers="servers"
      :apps="apps"
      :tasks="tasks"
      :upgrade-fetch="fetchData"
    />
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      isLoading: false,
      servers: [],
      apps: [],
      tasks: [],
      clickedElement: null,
      showDialog: false,
      showEdit: false,
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
    headersApp: function () {
      return [
        {
          text: this.$t('servers'),
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
    headersTask: function () {
      return [
        {
          text: this.$t('servers'),
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: this.$t('desc'), value: 'description' },
        { text: 'Id', value: 'id' },
        { text: this.$t('serverId'), value: 'serverId' },
        { text: this.$t('appId'), value: 'appId' },
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
      const urls = [
        'http://localhost:3000/servers',
        'http://localhost:3000/apps',
        'http://localhost:3000/tasks',
      ]

      urls.forEach((url) =>
        fetch(url)
          .then((response) => response.json())
          .then((resp) => {
            if (url.includes('servers')) this.servers = resp
            else if (url.includes('apps')) this.apps = resp
            else this.tasks = resp
            this.isLoading = false
          })
      )
    },

    handleShowDetails(item) {
      this.showEdit = !this.showEdit
      this.itemToEdit = item
    },

    handleAdd(element) {
      this.showDialog = !this.showDialog
      if (element === 'server') {
        this.clickedElement = {
          type: 'servers',
          title: 'Dodaj serwer',
          color: 'primary',
        }
      } else if (element === 'app') {
        this.clickedElement = {
          type: 'apps',
          title: 'Dodaj Aplikacje',
          color: 'green',
          addServer: true,
        }
      } else {
        this.clickedElement = {
          type: 'tasks',
          title: 'Dodaj taska',
          color: 'red',
          addServer: true,
          addApp: true,
        }
      }
    },
  },
}
</script>

<style scoped>
.tableEl {
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 0 5px rgb(204, 204, 204);
}
.tableEl >>> tbody tr :hover {
  cursor: pointer;
}
.button-add {
  width: 100%;
  max-width: 280px;
}
.button-container {
  box-shadow: 0 0 5px rgb(204, 204, 204);
  max-height: 85vh;
}
</style>
