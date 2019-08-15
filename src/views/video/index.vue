<template>
  <div>
    <div>
      <!-- <el-button @click="getVideoInfo">视频信息</el-button> -->
    </div>
    <div id="agora_local"></div>
    <div class="video" :id="remoteStreamDoMID"></div>
    <!-- <div class="video" v-for="(item, i) in videoDivListSet" :key="i" :id="item"></div> -->
    <div class="video666Wrap" ref="video666">
      <div id="agora_remote666"></div>
      <el-button type="primary" size="small" @click="stopClick">暂停</el-button>
      <el-button type="primary" size="small" @click="playClick">播放</el-button>
    </div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk";
import { videoConfig } from "@/utils/config.js";
import http from "@/utils/request";
export default {
  name: "home",
  data() {
    return {
      client: {},
      uid: 0,
      remoteStreamDoMID: "",
      remoteStreamDoMID666: "",
      localStream: {},
      videoDivList: [],
      videoDivList666: [],
      remoteStream: {}
    };
  },
  created() {
    this.init();
  },
  computed: {
    channel() {
      return this.$route.query.room;
    },
    videoDivListSet() {
      return [...new Set(this.videoDivList)];
    },
    videoDivListSet666() {
      return [...new Set(this.videoDivList666)];
    },
    room() {
      return this.$store.state.whiteRoom
    }
  },
  methods: {
    // 初始化 Client 对象
    init() {
      let { appID, mode, codec } = videoConfig;
      this.client = AgoraRTC.createClient({ mode, codec });

      this.client.init(
        appID,
        () => {
          console.log("AgoraRTC client 初始化成功");
          this.$store.commit("SET_client", this.client);
          this.join();
        },
        function(err) {
          console.log("AgoraRTC client 初始化失败:", err);
        }
      );
    },
    // 加入
    join() {
      // 加入直播间
      /**
       * @param token
       * @param channel：频道名称。
       * @param uid 用户的 ID， 整数，需保证唯一性, 如果不指定，即用户 ID 设置为 null，回调会返回一个服务器分配的 uid。
       */
      let _this = this;
      this.client.join(
        videoConfig.token,
        this.channel,
        null,
        uid => {
          console.log("用户 " + uid + " 加入直播间成功:" + this.channel);
          this.uid = uid;
          this.createSteam();
          console.log("client:", this.client);

          //设置 role（用户角色）。role 分为 “host”（主播）和 “audience”（观众）。
          this.client.setClientRole(
            "host",
            function() {
              console.log("setHost success:设置Host成功");
            },
            function(e) {
              console.log("setHost failed: 设置Host失败", e);
            }
          );

          //角色变化的回调
          this.client.on("client-role-changed", function(evt) {
            console.log("client-role-changed:完成角色变化", evt.role);
          });
          /**
           * 订阅远端音视频
           * 监听 client.on('stream-added') 事件, 当有人发布音视频流到频道里时，会收到该事件。
           * 收到事件后，在回调中调用 client.subscribe 方法订阅远端音视频流。
           */
          // _this.client.subscribe(stream, function (err) {
          //   console.log("Subscribe stream failed222222222", err);
          // });

          _this.client.on("stream-added", function(evt) {
            var stream = evt.stream;
            console.log("New stream added:创建流1111111111111 " + stream.getId());
            // 设置小流
            // _this.client.setRemoteVideoStreamType(stream, videoConfig.streamType)
            // _this.client.setLowStreamParameter({
            //   width: 120,
            //   height: 120,
            //   framerate: 15,
            //   bitrate: 120,
            // })

            _this.client.subscribe(stream, function(err) {
              console.log("Subscribe stream failed", err);
            });
          });

          _this.client.on("stream-subscribed", function(evt) {
            var remoteStream = evt.stream;
            console.log("订阅远程流成功: " + remoteStream.getId());
            // _this.$store.commit("SET_stream", remoteStream);
            let id = "agora_remote" + remoteStream.getId();

            if(remoteStream.getId() == 666) {
              _this.remoteStreamDoMID666 = id
              _this.$nextTick(()=>{
                _this.$refs.video666.style.zIndex =10
                remoteStream.play(_this.remoteStreamDoMID666);
                 _this.remoteStream = remoteStream
              })
             
              return
            }
            _this.remoteStreamDoMID = id
            setTimeout(() => {
              remoteStream.play(_this.remoteStreamDoMID);
            }, 1000);
          });
        },
        function(err) {
          console.log("加入直播间失败:", err);
        }
      );
    },
    // 创建音视频流
    // 初始化音视频流
    createSteam() {
      let _this = this;
      var localStream = AgoraRTC.createStream({
        streamID: _this.uid,
        audio: true,
        video: true,
        screen: false
      });
      this.localStream = localStream;

      localStream.setVideoProfile("1080p");
      localStream.init(
        function() {
          console.log("初始化流成功,播放本地流");
          localStream.play("agora_local");
          _this.$store.commit("SET_stream", localStream);

          // 发布本地音视频流
          _this.client.publish(localStream, function(err) {
            console.log(
              "Publish local stream error:发布本地音视频流错误 " + err
            );
          });

          _this.client.on("stream-published", function(evt) {
            console.log(
              "Publish local stream successfully,发布本地音视频流成功"
            );
          });
        },
        function(err) {
          console.log("getUserMedia failed", err);
        }
      );
      //
      _this.client.on("peer-leave", function(evt) {
        var uid = evt.uid;

        let dom = document.getElementById('agora_remote' + uid)
        console.log("离开房间 ", "agora_remote" + uid);
        if(uid == 666) {
          _this.$refs.video666.style.zIndex = -1
          return
        }
        dom&& dom.remove()
      });
    },
    leaveRoom() {
      this.client.leave(
        function() {
          console.log("Leave channel successfully");
        },
        function(err) {
          console.log("Leave channel failed");
        }
      );
    },
    getVideoInfo() {
      console.log("getVideoTrack", this.localStream.getVideoTrack());
      console.log("getStats", this.localStream.getStats());
      //  console.log('setVideoProfile', this.localStream.setVideoProfile())
      console.log("getSystemStats", this.client, this.client.getSystemStats());
    },

    // 利用白板的自定义事件,进行播放暂停
    stopClick(){
      this.room.dispatchMagixEvent('stop', {});
      console.log('触发自定义事件: stop')
    },
    playClick() {
      this.room.dispatchMagixEvent('play', {});
      console.log('触发自定义事件: play')
    },
  }
};
</script>
<style lang="less" scoped>
#agora_local {
  width: 400px;
  height: 300px;
  // background: red;
}
.video {
  width: 200px;
  height: 100px;
  // background: yellowgreen;
}
.video666Wrap {
    width: 80%;
    max-width: 1200px;
    height: 90%;
    position: fixed;
    top: 0;
    left: 0px;
    z-index: -1;
    background-color: #ffffff;
    margin-left: 10px;
  > div {
    width: 100%;
    height: 90%;
    margin-bottom: 20px;
  }
}
</style>

<style lang="less">
#player_666{
  display: flex;
  justify-content: center;
}
#video666{
  // width: auto!important;
  max-width: 1000px;
  height: auto!important;
}
</style>

