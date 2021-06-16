
const state = () => ({
    events: [],
})

// getters
const getters = {
    events: (state) => {
        return state.events
    },
}

// actions
const actions = {
    addEvent ({ commit }, payload) {
        commit('pushEvents', { payload })
    },
    clearAll ({ commit }) {
        commit('clearEvents')
    },
    deleteEvent ({commit}, payload) {
        commit('deleteEvent', { payload })
    }
}

// mutations
const mutations = {
    pushEvents (state, { payload }) {
        state.events.push(payload)
    },
    clearEvents (state) {
        state.events = []
    },
    deleteEvent (state, { payload }) {
        const newArr = state.events.filter(n => n.eventId !== payload);
        state.events = newArr
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}