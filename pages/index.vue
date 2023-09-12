<template>
  <v-row>
    <v-col cols="3" class="mt-4 d-flex flex-column align-center">
      <v-btn
        color="primary"
        class="button-add"
        elevation="2"
        @click="handleAddServer"
        x-large
        >Dodaj Serwer</v-btn
      >
      <v-btn color="green" class="button-add mt-4 mb-4" elevation="2" x-large
        >Dodaj Aplikacje</v-btn
      >
      <v-btn color="red" class="button-add" elevation="2" x-large
        >Dodaj Taska</v-btn
      >
    </v-col>
    <v-col cols="9" class="mt-4">
      <v-data-table
        v-if="servers !== null"
        :headers="headersServ"
        :items="servers"
        :items-per-page="5"
        class="tableEl rounded-lg"
        @click:row="handleShowServerDetails"
      >
      </v-data-table>
      <v-data-table
        v-if="apps !== null"
        :headers="headersApp"
        :items="apps"
        class="tableEl mb-6 mt-6 rounded-lg"
        :items-per-page="5"
      ></v-data-table>

      <v-data-table
        v-if="tasks !== null"
        :headers="headersTask"
        :items="tasks"
        :items-per-page="5"
        class="tableEl mb-6 mt-6 rounded-lg"
      ></v-data-table>
    </v-col>
    <dialog-component v-model="showDialog"></dialog-component>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      servers: null,
      apps: null,
      tasks: null,
      showDialog: false,
      headersServ: [
        {
          text: 'Serwery',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: 'Opis', value: 'description' },
        { text: 'Id', value: 'id' },
        { text: 'Data utworzenia', value: 'date' },
      ],
      headersApp: [
        {
          text: 'Aplikacje',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: 'Opis', value: 'description' },
        { text: 'Id', value: 'id' },
        { text: 'Id serwera', value: 'serverId' },
        { text: 'Data utworzenia', value: 'date' },
      ],
      headersTask: [
        {
          text: 'Taski',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: 'Opis', value: 'description' },
        { text: 'Id', value: 'id' },
        { text: 'Id serwera', value: 'serverId' },
        { text: 'Data utworzenia', value: 'date' },
      ],
    }
  },
  mounted() {
    const urls = ['data/servers.json', 'data/apps.json', 'data/tasks.json']

    urls.forEach((url) =>
      fetch(url)
        .then((response) => response.json())
        .then((resp) => {
          if (url.includes('servers')) this.servers = resp
          else if (url.includes('apps')) this.apps = resp
          else this.tasks = resp
        })
    )
  },
  methods: {
    handleShowServerDetails(item) {},

    handleAddServer() {
      this.showDialog = true
    },
  },
}
</script>

<style>
.tableEl {
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 0 5px rgb(204, 204, 204);
}

.button-add {
  width: 100%;
  max-width: 280px;
}
</style>
