<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card v-if="element && serverItems">
      <v-toolbar :color="element.color" dark>
        <p class="font-weight-medium text-center title">{{ element.title }}</p>
      </v-toolbar>
      <v-form ref="form" lazy-validation class="form">
        <v-text-field
          v-model="inputName"
          :counter="16"
          :rules="nameRules"
          required
          :label="$t('name')"
        ></v-text-field>
        <v-text-field
          v-model="inputDesc"
          :counter="30"
          :rules="descriptionRules"
          required
          :label="$t('desc')"
        ></v-text-field>
        <v-select
          v-if="element.addServer"
          v-model="inputServerId"
          required
          :rules="serverIdRules"
          :items="serverItems"
          item-value="id"
          item-text="name"
          :label="$t('choseServer')"
        ></v-select>
        <v-select
          v-if="element.addApp"
          v-model="inputAppId"
          required
          :items="appItems"
          item-value="id"
          item-text="name"
          :label="$t('choseApp')"
        ></v-select>
        <v-btn
          :color="element.color"
          class="mr-4 mt-2 submit"
          @click="onSubmit"
        >
          {{ $t('add') }}
        </v-btn>
      </v-form>
      <v-card-actions class="justify-end">
        <v-btn text @click="handleClose"> {{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  nameRules,
  serverIdRules,
  descriptionRules,
} from '../validation/formRules'

export default {
  name: 'DialogComponent',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    element: {
      type: Object,
      required: false,
      default: null,
    },
    servers: {
      type: Array,
      required: true,
    },
    apps: {
      type: Array,
      required: true,
    },
    upgradeFetch: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      serverItems: null,
      appItems: null,
      nameRules,
      serverIdRules,
      descriptionRules,
      inputName: '',
      inputDesc: '',
      inputServerId: null,
      inputAppId: null,
    }
  },
  watch: {
    value: {
      handler() {
        this.dialog = true
      },
    },
    servers: {
      handler(s) {
        this.serverItems = s
      },
    },
    apps: {
      handler(a) {
        this.appItems = a
      },
    },
  },
  methods: {
    handleCreate() {
      this.$refs.form.resetValidation()
      const type = this.element.type
      const day =
        new Date().getDate() < 10
          ? `0${new Date().getDate()}`
          : new Date().getDate()

      const month =
        new Date().getMonth() + 1 < 10
          ? `0${new Date().getMonth() + 1}`
          : new Date().getMonth() + 1

      const currentDate = `${day}-${month}-${new Date().getFullYear()}`

      const elementBody = {
        name: this.inputName,
        description: this.inputDesc,
        type: type === 'servers' ? 'server' : type === 'apps' ? 'app' : 'task',
      }

      if (type === 'apps' || type === 'tasks')
        elementBody.serverId = this.inputServerId

      if (this.element.type === 'tasks')
        elementBody.appId = this.inputAppId === null ? 'brak' : this.inputAppId

      elementBody.date = currentDate
      fetch(`http://localhost:3000/${this.element.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elementBody),
      }).then(() => this.upgradeFetch())
    },

    handleClose() {
      this.dialog = false
      this.inputDesc = ''
      this.inputName = ''
      this.inputServerId = null
      this.inputAppId = null
      this.$refs.form.resetValidation()
    },

    onSubmit() {
      this.$nextTick(() => {
        if (this.$refs.form.validate()) {
          this.handleCreate()
          this.dialog = false
          this.$refs.form.reset()
        }
      })
    },
  },
}
</script>

<style>
.title {
  margin: 0 !important;
  padding: 0;
  width: 100%;
}

.form {
  padding: 2rem;
}
</style>
