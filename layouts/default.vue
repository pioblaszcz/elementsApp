<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="navigationEl" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title class="ml-4 logo d-flex align-center">
        <v-img class="logo__item" :lazy-src="logo" :src="logo" />
      </v-toolbar-title>
      <v-spacer />
      <button
        class="buttonLang mr-8"
        :class="currentLang === 'en' ? 'pl' : 'gb'"
        @click="changeLanguage()"
      ></button>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import logo from '../static/images/logoVectioLong.png'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      currentLang: 'en',
      miniVariant: false,
      logo,
      right: true,
    }
  },
  computed: {
    items: function () {
      return [
        {
          icon: 'mdi-apps',
          title: 'Start',
          to: this.localePath('/'),
        },
        {
          icon: 'mdi-chart-bubble',
          title: this.$t('servers'),
          to: this.localePath('/servers'),
        },
        {
          icon: 'mdi-android',
          title: this.$t('apps'),
          to: this.localePath('/apps'),
        },
        {
          icon: 'mdi-check-circle-outline',
          title: this.$t('tasks'),
          to: this.localePath('/tasks'),
        },
      ]
    },
  },
  methods: {
    changeLanguage() {
      this.currentLang = this.currentLang === 'en' ? 'pl' : 'en'
      this.$i18n.setLocale(this.currentLang)
    },
  },
}
</script>
<style>
.navigationEl {
  box-shadow: 2px 0 7px #077a8e !important;
}

.logo {
  height: 100px;
}

.logo__item {
  width: 105px;
}

.buttonLang {
  height: 30px !important;
  width: 30px !important;
  background-size: cover;
  background-position: center;
}

.pl {
  background-image: url('../static/images/pl.png');
}

.gb {
  background-image: url('../static/images/gb.png');
}
</style>
