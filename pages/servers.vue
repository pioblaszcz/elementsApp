<template>
    <div v-if="tasks!==null" class="d-flex flex-column align-center">
          <v-btn
            v-for="server in servers" 
            :key="server.id"
            outlined
            elevation="4"
            class="mb-4 buttonEl"
            @click="showDetails"
          >
          {{ server.name }}
          </v-btn>
        </div>
    </template>
    
    <script>
  
    export default {
        name: 'Server',
        data(){
        return{
          servers: null,
        }
      },
      mounted() {
        fetch('data/servers.json')
          .then(response => response.json())
          .then(resp => {this.servers = resp})
      }
    }
    </script>
    