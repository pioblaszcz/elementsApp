<template>
  <v-dialog
    v-model="edit"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card>
      <v-toolbar :color="color" dark>
        <p class="font-weight-medium text-center title">
          {{ $t('editElement') }}
        </p>
      </v-toolbar>
      <v-form ref="form" lazy-validation class="form">
        <v-text-field
          v-model="name"
          :counter="16"
          :rules="nameRules"
          required
          :label="$t('name')"
        ></v-text-field>
        <v-text-field
          v-model="description"
          :counter="30"
          :rules="descriptionRules"
          required
          :label="$t('desc')"
        ></v-text-field>
        <v-select
          v-if="type === 'app' || type === 'task'"
          v-model="inputServerId"
          required
          :rules="serverIdRules"
          :items="serverItems"
          item-value="id"
          item-text="name"
          :label="$t('choseServer')"
        ></v-select>
        <v-select
          v-if="type === 'task'"
          v-model="inputAppId"
          :items="appItems"
          item-value="id"
          item-text="name"
          :label="$t('choseApp')"
        ></v-select>
        <v-btn :color="color" class="mr-4 submit" @click="onSubmit">
          {{ $t('edit') }}
        </v-btn>
        <v-btn color="red" :disabled="disableDelate" @click="handleDelate">
          DELETE
        </v-btn>
        <p v-if="disableDelate" class="red--text font-bold mt-1 disableError">
          {{ $t('delateError') }}
        </p>
      </v-form>
      <v-card-actions class="justify-end">
        <v-btn text @click="edit = false">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  nameRules,
  descriptionRules,
  serverIdRules,
} from '../validation/formRules'

export default {
  name: 'EditComponent',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    servers: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    apps: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    tasks: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    upgradeFetch: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      edit: false,
      name: '',
      description: '',
      serverItems: null,
      appItems: [],
      taskItems: null,
      type: '',
      inputServerId: null,
      inputAppId: null,
      id: null,
      color: null,
      nameRules,
      descriptionRules,
      serverIdRules,
    }
  },
  computed: {
    disableDelate: function () {
      if (this.item.type === 'server')
        return (
          this.appItems.findIndex((app) => app.serverId === this.item.id) >
            -1 ||
          this.taskItems.findIndex((task) => task.serverId === this.item.id) >
            -1
        )
      else return false
    },
  },
  watch: {
    value: {
      handler() {
        this.edit = true
      },
    },
    item: {
      handler() {
        this.name = this.item.name
        this.description = this.item.description
        this.type = this.item.type
        this.id = this.item.id
        this.inputServerId =
          this.item.type !== 'server' ? this.item.serverId : null
        this.inputAppId = this.item.type === 'task' ? this.item.appId : null
        this.color =
          this.type === 'server'
            ? 'primary'
            : this.type === 'app'
            ? 'green'
            : 'red'
      },
    },
    servers: {
      handler(s) {
        this.serverItems = s
      },
    },
    apps: {
      handler(a) {
        a.forEach((item) => this.appItems.push(item))
      },
    },
    tasks: {
      handler(t) {
        this.taskItems = t
      },
    },
  },
  mounted() {
    this.appItems.push({ name: this.$t('unpin'), id: -1 })
  },
  methods: {
    handleEdit() {
      const day =
        new Date().getDate() < 10
          ? `0${new Date().getDate()}`
          : new Date().getDate()

      const month =
        new Date().getMonth() + 1 < 10
          ? `0${new Date().getMonth() + 1}`
          : new Date().getMonth() + 1

      const currentDate = `${day}-${month}-${new Date().getFullYear()}`

      const body = {
        name: this.name,
        description: this.description,
        date: currentDate,
      }

      if (this.serverItems) body.serverId = this.inputServerId
      if (this.appItems) {
        body.appId = this.inputAppId !== -1 ? this.inputAppId : null
      }

      fetch(`http://localhost:3000/${this.type}s/${this.id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then(() => this.upgradeFetch())
    },
    handleDelate() {
      this.edit = false
      fetch(`http://localhost:3000/${this.type}s/${this.id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then(() => this.upgradeFetch())
    },
    onSubmit() {
      this.$nextTick(() => {
        if (this.$refs.form.validate()) {
          this.handleEdit()
          this.edit = false
        }
      })
    },
  },
}
</script>
<style>
.disableError {
  font-size: 12px;
}
</style>
