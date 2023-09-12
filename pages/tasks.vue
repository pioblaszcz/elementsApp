<template>
<div v-if="tasks!==null" class="d-flex flex-column align-center">
      <v-btn
        v-for="task in tasks" 
        :key="task.id"
        outlined
        elevation="4"
        class="mb-4 buttonEl"
        @click="showDetails"
      >
      {{ task.name }}
      </v-btn>
    </div>
</template>

<script>

export default {
    name: 'Tasks',
    data(){
    return{
      tasks: null,
    }
  },
  mounted() {
    fetch('data/tasks.json')
      .then(response => response.json())
      .then(resp => {this.tasks = resp})
  }
}
</script>
