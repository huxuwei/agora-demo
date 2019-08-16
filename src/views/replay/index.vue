<template>
  <div class="replay-page">
    <div>
      <el-button @click="play">播放</el-button>
    </div>
    <div class="replay-player" ref="whiteboard"></div>
    <div>
      <video class="video-js video-layout"  id="white-sdk-video-js"></video>
    </div>
  </div>
</template>

<script>
import http from '@/utils/request'
import {whiteConfig} from '@/utils/config.js'
// import videojs from 'video.js'
import "video.js/dist/video-js.css";
export default {
  mounted() {
    // this.init()
  },
  methods: {
    play(){
      this.init()
    },
    init() {
      http.get('roomInfo',{name:this.$route.query.room}).then(res=>{
        
        this.replay(res.data)
      })
    },
    replay(data) {
      let {roomToken, uuid,videoPath, startTime  } = data
      // var roomUUID = this.$route.query.uuid; // 希望回放房间的 uuid，必须是可回放模式的房间
      // var roomToken = this.$route.query.roomToken; // room Token，获取方式原来一致
      // var beginTimestamp = ...; // 回放的开始片段的事件，整数，Unix 时间戳（毫秒）
      // var duration = ...; // 回放片段持续时长（毫秒）
      // var mediaURL = "https://example.com/media.m3u8"; // 由白板接管的媒体文件(可选)，如果需要显示视频，需要提前做一些操作
      var whiteWebSdk = new WhiteWebSdk();
      console.log('data',data)
      whiteWebSdk.replayRoom({
        room: uuid,
        roomToken: roomToken,
        mediaURL: videoPath,
        // beginTimestamp: startTime
      }).then((player)=> {
        // 获取到 player 实例
        // 与 room 调用类似，与获取到 player 实例后，你需要将 player 绑定到 HTML 的 div 上。
        // videojs(this.$refs.videoPlayer, playerOptions);
        player.bindHtmlElement(this.$refs.whiteboard);
        player.play()
      })
    }
  },
}
</script>

<style lang="less" scoped>
.replay-page{
  width: 100%;
  height: 100vh;
  display: flex;
  .replay-player{
    flex-basis: 80%;
    height: 80%;
  }
  .player-video {
        width:300px;
        height: 300px;
        position: absolute;
        z-index: 1;
        background-color: black;
    }

    .video-layout {
        width: 300px;
        // height: 300px;
    }
}
</style>
