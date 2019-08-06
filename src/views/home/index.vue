<template>
  <div class="room-page">
    <div class="room-page-main">
      <div class="room-page-left">
        <white-room></white-room>
      </div>
      <div class="videoWrap">
        <video-room></video-room>
      </div>
    </div>
  </div>
</template>

<script>
import VideoRoom from '@/views/video'
import WhiteRoom from "@/views/white/whiteJoin";
export default {
  components: {WhiteRoom, VideoRoom}
}
</script>

<style lang="less" scoped>
.room-page{
  height: 100vh;
  .room-page-main{
    display: flex;
    .room-page-left{
      flex-basis: 80%;
      height: 100vh;
    }
  }
  
}
</style>
