import Vue from "vue";

export const nameRules = [
    v => !!v || Vue.prototype.$nuxt.$options.i18n.t('rules.name'),
    v =>(v && v.replace(/\s/g, '').length > 0) || Vue.prototype.$nuxt.$options.i18n.t('rules.nameSpace'),
    v => (v && v.length <= 16) || Vue.prototype.$nuxt.$options.i18n.t('rules.nameMax'),
]

export const descriptionRules = [
    v => (!v || v.length <= 30) || Vue.prototype.$nuxt.$options.i18n.t('rules.desc'),
]

export const serverIdRules = [
    v => v!==null || Vue.prototype.$nuxt.$options.i18n.t('rules.serv'),
]
