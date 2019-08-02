import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    videoRoom: ''
  },
  mutations: {
    SET_videoRoom: (state, room) =>{
      state.videoRoom = room
    }
  },
  actions: {

  }
})
