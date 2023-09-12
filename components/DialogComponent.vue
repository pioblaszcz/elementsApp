<template>
  <v-dialog v-model="dialog" max-width="600"> </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
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
      handler(v) {
        this.dialog = v
      },
    },
  },
}
</script>

<style></style>
