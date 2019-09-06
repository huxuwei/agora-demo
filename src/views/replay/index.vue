<template>
  <video id="my-video"  class="video-js vjs-default-skin" controls preload="auto" >
    <!-- <source :src="src" type="application/x-mpegURL"> -->
    <source :src="src" type="application/x-mpegURL">
    
  </video>
</template>

<script>
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import 'videojs-contrib-hls'
import http from '@/utils/request'
export default {
  data() {
    return {
      src: ''
    }
  },
  mounted() {
   this.$nextTick(()=>{
      this.init()
   })
  },
  methods: {
    init() {
      http.get('roomInfo',{name:this.$route.query.room}).then(res=>{
        this.src = res.data.videoPath
      this.$nextTick(()=>{
        var player = videojs('my-video', {
          bigPlayButton: false,
          textTrackDisplay: false,
          posterImage: false,
          errorDisplay: false,
          controlBar: true
        //   controlBar:  {
        //     captionsButton : false,
        //     chaptersButton: false,
        //     subtitlesButton:false,
        //     liveDisplay:false,
        //     playbackRateMenuButton:false
        // }
        },  ()=> {
          // player.src({
          //   src: this.src,
          //   type: 'video/m3u8'
          // });
            player.play()
        })
      })
      })
    },
  }
}
</script>