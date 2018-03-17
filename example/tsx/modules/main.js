export default {
  state: {
    gongyong: 0
  },

  mutations: {
    mutationGongyong(state, gongyong) {
      state.gongyong = gongyong
    }
  },

  actions: {
    updateGongyong({ state, commit }, gongyong) {
      commit('mutationGongyong', gongyong || (state.gongyong + 1))
    }
  }
}