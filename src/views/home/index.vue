<template>
  <div class="room-page">
    <div class="room-page-main">
      <div class="room-page-left">
        <white-room v-if="initFinish"></white-room>
      </div>
      <div class="videoWrap">
        <video-room v-if="initFinish"></video-room>
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
      initFinish: false
    }
  },
  created() {
    this.init()
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
      http.get("roomName", { name: this.room }).then(res => {
        console.log("res", res.data);
        let { herewhite, agora , file} = res.data;
        this.roomInfo = {
          uuid: herewhite.uuid,
          name: agora.name,
          role: this.role,
          roomToken: herewhite.roomToken
        };
        for (const key in this.roomInfo) {
          localStorage.setItem(key, this.roomInfo[key])
        }
        this.$store.commit('SET_fileList', file)
        this.initFinish = true
      });
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
</style>
