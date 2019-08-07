<template>
    <div class="white-wrap">
      <div class="wrap" ref="whiteWrap"></div>
      <WhiteTool class="white-tools" @changeTool="changeTool"></WhiteTool>
      <el-button @click="ended">下课</el-button>
      <!-- <el-button @click="pptShow">ppt</el-button> -->
    </div>
</template>

<script>
import {whiteConfig} from '@/utils/config.js'
import WhiteTool from './tools'
import http from '@/utils/request'
import axios from 'axios'
export default {
  components: {WhiteTool},
  data() {
    return {
      room: {},
      whiteWebSdk: {}
    }
  },
  mounted() {
    document.body.style.overflow = "hidden";
    window.addEventListener('resize', ()=>{
      if(this.room){
        console.log('resize',this.room.refreshViewSize)
        this.room.refreshViewSize()
      }
    })
    this.init()
  },
  computed: {
    uuid() {
      return  this.$route.query.uuid
    }
  },
  methods: {
    init() {
      const that = this
      var sdkToken = whiteConfig.token;
      var url = `https://cloudcapiv4.herewhite.com/room/join?token=${sdkToken}&uuid=${this.uuid}`;
      var requestInit = {
          method: 'POST',
          headers: {
              "content-type": "application/json",
          },
          body: JSON.stringify({
              name: '我的第一个 White 房间',
              limit: 4, // 房间人数限制
          }),
      };

      // 请求加入房间
        // 请求创建房间（网络请求部分逻辑，请在服务器实现）
        fetch(url, requestInit).then(function(response) {
            // Step1: 服务器返回进入房间的秘钥 roomToken
            return response.json();
        }).then(function(json) {
            // Step2: 加入房间
            return that.initAndJoinRoom(json);
        }).then(function(room) {
            // Step3: 加入成功后想白板绑定到指定的 dom 中
          room.bindHtmlElement(that.$refs.whiteWrap)
          room.refreshViewSize()
          that.room = room
        }).catch(function(err) {
            console.log(err);
        });

     
    },
    initAndJoinRoom (json) {
      // 初始化 SDK，并且调用其成员方法 joinRoom
      this.whiteWebSdk = new WhiteWebSdk();
      return this.whiteWebSdk.joinRoom({
          uuid: this.uuid,
          roomToken: json.msg.roomToken,
      });
    },
    changeTool(val) {
      this.room.setMemberState({
        currentApplianceName: val,
    });
    },
    ended() {
      axios({
        url: `https://cloudcapiv4.herewhite.com/banRoom?token=${whiteConfig.token}`,
        method: 'POST',
        data: {
          ban: true,
          uuid: this.uuid
        }
      })
    },
    pptShow() {
      //之前初始化的 sdk 实例，roomToken 创建房间时，具体房间的 roomToken，此处作为鉴权使用。
      console.log('wqwe',this.whiteWebSdk.pptConverter)
      var pptConverter = this.whiteWebSdk.pptConverter(this.$store.state.roomInfo.roomToken);
      pptConverter.convert({
        url: 'staticConvert/b4b22aae53894153b4b5406040ab458d/2.png',
        kind: "dynamic",
      }).then(function(result) {
        // scenes 就是用来创建 pptx 对应的场景的描述信息
        var scenes = result.scenes;
      });
    }
  },
}
</script>

<style lang="less" scoped>
.white-wrap{
  position: relative;
  height: 100%;
  .wrap{
    width: 100%;
    height: 90%;
    background-color: rgb(241, 243, 244);
  }
  .white-tools{
    position: absolute;
    top: 20px;
    left:50%;
    transform: translateX(-50%);
  }
}

</style>
