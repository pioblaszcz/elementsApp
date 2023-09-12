<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card>
      <v-toolbar color="primary" dark>{{ element }}</v-toolbar>
      <v-card-text>
        <div class="text-h2 pa-12"></div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    element: {
      type: String,
      required: true,
    },
  },
  name: 'DialogComponent',
  data() {
    return {
      dialog: false,
    }
  },
  watch: {
    value: {
      handler() {
        this.dialog = true
      },
    },
  },
}
</script>

<style></style>
