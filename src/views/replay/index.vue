<template>
  <div class="replay-page">
    <div  class="replay-player" ref="whiteboard"></div>
    <div id="white-sdk-video-js" ref="videoPlayer"></div>
  </div>
</template>

<script>
import {whiteConfig} from '@/utils/config.js'
import videojs from 'video.js'
import "video.js/dist/video-js.css";
export default {
  mounted() {
    this.$nextTick(()=>{
      this.replay()
    })
  },
  methods: {
    replay() {
      var roomUUID = this.$route.query.uuid; // 希望回放房间的 uuid，必须是可回放模式的房间
      var roomToken = this.$route.query.roomToken; // room Token，获取方式原来一致
      // var beginTimestamp = ...; // 回放的开始片段的事件，整数，Unix 时间戳（毫秒）
      // var duration = ...; // 回放片段持续时长（毫秒）
      // var mediaURL = "https://example.com/media.m3u8"; // 由白板接管的媒体文件(可选)，如果需要显示视频，需要提前做一些操作
        // console.log(whiteWebSdk)
        var whiteWebSdk = new WhiteWebSdk({
      //     // 用户手动进行缩放操作时的上下限，默认 为 0.1~10。
      //     // 缩放 API 不受影响
      //     // zoomMaxScale: 3, 
      //     // zoomMinScale: 0.3,
      //     // 图片替换 API，可以在插入图片和创建新场景背景图时，替换传入的 url。
      //     // 如果没有需要，请不要传入，可以减少前端资源开销
      //     // 使用该 API 后，服务器截屏时，会使用原始图片地址
      });
      
      var playerOptions = {controls: {
        "play": "playToggle",
        "volume": "volumePanel",
        "seekbar": "progressControl",
        "timer": "remainingTimeDisplay",
        "playbackrates": "playbackRateMenuButton",
        "fullscreen": "fullscreenToggle",
      }, preload: "auto"};
    
      // videojs(this.$refs.videoPlayer, playerOptions);
      whiteWebSdk.replayRoom({
          room: roomUUID,
          roomToken: roomToken,
          // beginTimestamp: 1564996102002,
          mediaURL: 'http://pvsytwo44.bkt.clouddn.com/732f37103d48dda3852bd59e6896bc27_666.m3u8',
          // duration: duration,
      }).then((player)=> {
          // 获取到 player 实例
          // 与 room 调用类似，与获取到 player 实例后，你需要将 player 绑定到 HTML 的 div 上。
          videojs(this.$refs.videoPlayer, playerOptions);
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
  .replay-player{
    height: 80%;
  }
  #white-sdk-video-js{
    height: 400px;
  }
}
</style>
