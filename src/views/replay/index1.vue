<template>
  <div>
    <div>
      <el-button @click="start">开始</el-button>
      <!-- <el-button @click="pause"></el-button> -->
      <el-button @click="play">{{buttonText}}</el-button>
    </div>
    
    <div  class="replay-page">
      <div class="replay-player" ref="whiteboard"></div>
      <video class="video-js video-layout"  id="white-sdk-video-js"></video>
    </div>
    <div class="player-progress" v-if="isStart">
      <!-- <el-progress :percentage="percentage" status="exception"></el-progress>
      <el-progress :percentage="percentage" status="exception"></el-progress> -->
       <span>{{nowTime}}</span>
      <g-progress  class='gprogress'
        :percentage="percentage" 
        @end="progressMoveEnd"></g-progress>
        <span>{{timeAll}}</span>
    </div>
  </div>
</template>

<script>
import http from '@/utils/request'
import {whiteConfig} from '@/utils/config.js'
// import videojs from 'video.js'
import "video.js/dist/video-js.css";
import {throttle, formatTime } from '@/utils/util'
import GProgress from '@/components/progress'
export default {
  components: {GProgress},
  data() {
    return {
      player: {},
      status: false,
      percentage: 0,
      scheduleTime: 0,
      isStart: false
    }
  },
  computed: {
    buttonText() {
      return this.status ? '暂停': '播放'
    },
    nowTime() {
      let date = formatTime(this.scheduleTime)
      return `${date.hour}:${date.minute}:${date.second}`
    },
    timeAll() {
      let date = formatTime(this.player.timeDuration)
      return `${date.hour}:${date.minute}:${date.second}`
    }
  },
  methods: {
    start(){
      this.init()
      this.isStart = true
    },
    play() {
      if(this.status){
        this.player.pause()
      }else{
        this.player.play()
      }
      this.status =!this.status
      
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
      whiteWebSdk.replayRoom({
        room: uuid,
        roomToken: roomToken,
        mediaURL: videoPath,
        // beginTimestamp: startTime
      }, {
          onPhaseChanged: phase => {
              console.log(phase);
          },
          onLoadFirstFrame: () => {
          },
          onPlayerStateChanged: modifyState => {
              console.log(modifyState);
          },
          onStoppedWithError: error => {
              console.log(error);
          },
          onScheduleTimeChanged:  throttle((scheduleTime)=>{
                let per = scheduleTime/ this.player.timeDuration
                this.percentage = per *100
                this.scheduleTime =scheduleTime
                // console.log(per, scheduleTime, this.player.timeDuration)
            },100)
      }).then((player)=> {
        // 获取到 player 实例
        // 与 room 调用类似，与获取到 player 实例后，你需要将 player 绑定到 HTML 的 div 上。
        // videojs(this.$refs.videoPlayer, playerOptions);
        player.bindHtmlElement(this.$refs.whiteboard);
        this.player = player
        console.log('player', player.timeDuration)
        player.play()
        this.status = true
      })
    },
    progressMoveEnd(percentage) {
      let scheduleTime = this.player.timeDuration * percentage /100
      this.player.seekToScheduleTime(scheduleTime);
    }
  },
}
</script>

<style lang="less" scoped>
.replay-page{
  width: 100%;
  height: 90vh;
  display: flex;
  .replay-player{
    flex-basis: 80%;
    height: 100%;
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
.player-progress{
      display: flex;
      span{
        line-height: 30px;
        margin: 0 10px;
      }
    }
 .gprogress{
  width: 600px;
}
</style>
