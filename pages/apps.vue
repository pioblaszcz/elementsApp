<template>
    <div v-if="tasks!==null" class="d-flex flex-column align-center">
          <v-btn
            v-for="app in apps" 
            :key="app.id"
            outlined
            elevation="4"
            class="mb-4 buttonEl"
            @click="showDetails"
          >
          {{ app.name }}
          </v-btn>
        </div>
    </template>
    
    <script>
    export default {
        name: 'Apps',
        data(){
        return{
          apps: null,
        }
      },
      mounted() {
        fetch('data/apps.json')
          .then(response => response.json())
          .then(resp => {this.apps = resp})
      }
    }
    </script>
    