<template>
  <v-row class="contaienrEl d-flex">
    <v-col
      cols="2.5"
      class="mt-4 mr-2 d-flex rounded-lg flex-column align-center button-container"
    >
      <v-btn
        color="transparent"
        prepend-icon="$vuetify"
        class="button-add"
        elevation="2"
        x-large
        @click="handleAdd('server')"
        >{{ $t('addServer__btn') }}</v-btn
      >
      <v-btn
        color="transparent"
        class="button-add mt-4 mb-4"
        elevation="2"
        x-large
        @click="handleAdd('app')"
        >{{ $t('addApp__btn') }}</v-btn
      >
      <v-btn
        color="transparent"
        class="button-add"
        elevation="2"
        x-large
        @click="handleAdd('task')"
        >{{ $t('addTask__btn') }}</v-btn
      >
      <v-card class="mx-auto mt-8 mb-10 comment" elevation="2" max-width="280">
        <v-card-text class="pb-0">
          <div>Comment</div>
          <div class="text--primary">
            relating to or dependent on charity; charitable.<br />
            "an eleemosynary educational institution."
            <v-expand-transition>
              <p v-show="reveal">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
                aspernatur consectetur obcaecati excepturi inventore quod magni
                itaque ipsa soluta veniam laboriosam recusandae quae nam maxime
                incidunt eaque similique eum aperiam?
              </p>
            </v-expand-transition>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="teal accent-4" @click="reveal = !reveal">
            {{ reveal ? 'Hide comment' : 'Read More' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="9" class="mt-4 tablesContainer">
      <v-skeleton-loader
        v-if="isLoading"
        class="mx-auto border"
        max-width="100%"
        max-height="25vh"
        type="table"
      ></v-skeleton-loader>
      <v-skeleton-loader
        v-if="isLoading"
        class="mx-auto border my-5"
        max-width="100%"
        max-height="25vh"
        type="table"
      ></v-skeleton-loader>
      <v-skeleton-loader
        v-if="isLoading"
        class="mx-auto border"
        max-width="100%"
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
      reveal: false,
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
          text: this.$t('apps'),
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: this.$t('desc'), value: 'description' },
        { text: 'Id', value: 'id' },
        { text: this.$t('serverId'), value: 'server' },
        { text: this.$t('date'), value: 'date' },
      ]
    },
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
    handleShowDetails(item) {
      this.showEdit = !this.showEdit
      this.itemToEdit = item
    },

    handleAdd(element) {
      this.showDialog = !this.showDialog
      if (element === 'server') {
        this.clickedElement = {
          type: 'servers',
          title: this.$t('addServer__btn'),
          color: 'primary',
        }
      } else if (element === 'app') {
        this.clickedElement = {
          type: 'apps',
          title: this.$t('addApp__btn'),
          color: 'green',
          addServer: true,
        }
      } else {
        this.clickedElement = {
          type: 'tasks',
          title: this.$t('addTask__btn'),
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
  box-shadow: 0 0 5px rgb(204, 204, 204) !important;
}
.tablesContainer {
  margin: 0 auto;
}

.contaienrEl {
  max-width: 90% !important;
  margin: 0 auto;
}

.comment {
  box-shadow: 0 0 5px rgb(204, 204, 204) !important;
}
</style>
