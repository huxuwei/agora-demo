import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    roomInfo: {},
    client: {},
    stream: {},
    fileList: []
  },
  mutations: {
    SET_roomInfo: (state, roomInfo) =>{
      state.roomInfo = roomInfo
    },
    SET_client: (state, client) =>{
      state.client = client
    },
    SET_stream: (state, stream) =>{
      state.stream = stream
    },
    SET_fileList: (state, fileList) =>{
      state.fileList = fileList
    }
  },
  actions: {

  },
  getters: {
    fileListStatic: state=>state.fileList.file,
    fileListMedia: state=>state.fileList.media,
  }
})
