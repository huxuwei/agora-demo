<template>
  <div class="room-page">
    <div class="room-page-main">
      <div class="room-page-left">
        <white-room :uidID='uid' v-if="uid" ref="whiteRoom"></white-room>
      </div>
      <div class="videoWrap">
        <video-room :uidID='uid' v-if="uid"></video-room>
      </div>
    </div>
  </div>
</template>

<script>
import VideoRoom from "@/views/video";
import WhiteRoom from "@/views/white/whiteJoin";
import http from "@/utils/request";
export default {
  components: { WhiteRoom, VideoRoom },
  data() {
    return {
      roomInfo: {},
      uid:0,
      initFinish: false
    }
  },
  created() {
    this.init()
    // this.websocketInit()
    // this.uid = parseInt(Math.random()*100000000)
    this.local()
    
  },
  computed: {
    role() {
      return this.$route.query.role
    },
    room() {
      return this.$route.query.room
    }
  },
  methods: {
    init() {
      http.get("roomName", { name: this.room,role: this.role }).then(res => {
        console.log("res", res.data);
        let { herewhite, agora , file} = res.data;
        this.roomInfo = {
          uuid: herewhite.uuid,
          name: agora.name,
          role: this.role,
          roomToken: herewhite.roomToken
        };
        this.uid  = agora.uid
        for (const key in this.roomInfo) {
          localStorage.setItem(key, this.roomInfo[key])
        }
        this.$store.commit('SET_fileList', file)
        this.initFinish = true
      });
    },
    local() {
      localStorage.setItem('role', this.role)
      localStorage.setItem('name', this.room)
    },
    setLocalStrong(data) {
      let { herewhite, agora , file} = data;
        this.roomInfo = {
          uuid: herewhite.uuid,
          name: agora.name,
          role: this.role,
          roomToken: herewhite.roomToken
        };
        for (const key in this.roomInfo) {
          localStorage.setItem(key, this.roomInfo[key])
        }
        console.log(2222222, file)
        this.$store.commit('SET_fileList', file)
    },  
    websocketInit() {
      let url = `wss://activate.navicat.com/websocket/onlineRoom?roomName=${this.room}&uid=${this.uid}&role=${this.role}`
      var ws
      if ("WebSocket" in window){
               // 打开一个 web socket
        ws = new WebSocket(url);
        ws.onopen = function(){
          // Web Socket 已连接上，使用 send() 方法发送数据
          console.log('websocket已连接')
        };
        
        ws.onmessage =  (evt)=> { 
          var received_msg = evt.data;
          // if(received_msg == '连接成功') return
          let data = JSON.parse(received_msg)
          if(data.classStart == 1) {

          }else if(data.herewhite){
            this.setLocalStrong(data)
            if(data.herewhite.status ){
              this.$refs.whiteRoom.init()
            }
          }
          
          console.log("数据已接收...:", received_msg);
        };
        
        ws.onclose = function(){ 
          // 关闭 websocket
          alert("连接已关闭..."); 
        };
        this.$store.commit('SET_ws', ws)
        
      }else{
          // 浏览器不支持 WebSocket
          console.log("您的浏览器不支持 WebSocket!");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.room-page {
  height: 100vh;
  .room-page-main {
    display: flex;
    .room-page-left {
      flex-basis: 80%;
      height: 100vh;
    }
  }
}
.videoWrap{
  width: 20%
}
</style>
