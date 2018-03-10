export default {
  state: {
    gongyong: 0
  },

  actions: {
    mutationGongyong(gongyong) {
      this.state.gongyong = gongyong || (this.state.gongyong + 1)
    }
  }
}