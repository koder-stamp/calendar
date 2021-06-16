import Vue from 'vue'
import Vuex from 'vuex'
import calendar from './modules/calendar'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        calendar
    },
    plugins: [createPersistedState()],
    strict: debug,
})