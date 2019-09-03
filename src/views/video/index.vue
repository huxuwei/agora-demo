<template>
  <div style="width:100%">
    <div v-if="teachRole">
      <!-- <el-button @click="getVideoInfo">视频信息</el-button> -->
      <!-- <el-button @click="shareSreen">屏幕共享</el-button> -->
      <!-- <el-button @click="unShare">取消共享</el-button> -->
    </div>
    <div id="agora_local"></div>
    <div id="screen"></div>
    <div class="video" :id="remoteStreamDoMID"></div>
    <!-- <div class="video" v-for="(item, i) in videoDivListSet" :key="i" :id="item"></div> -->
    <div class="video666Wrap" ref="video666">
      <div id="agora_remote666"></div>
      <template v-if="role == 1">
        <el-button type="primary" size="small" @click="stopClick">暂停</el-button>
        <el-button type="primary" size="small" @click="playClick">播放</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk";
import { videoConfig } from "@/utils/config.js";
import http from "@/utils/request";
export default {
  name: "home",
  props: ["uidID"],
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
      return this.$store.state.whiteRoom;
    },
    role() {
      return localStorage.getItem("role");
    },
    teachRole() {
      return this.$route.query.role == 1;
    },
    localStreams() {
      let arr = localStorage.getItem('localStreams')
      if(arr){
        return JSON.parse(localStorage.getItem('localStreams'))
      }
      return []
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
      console.log('this.uidID',this.uidID)
      this.client.join(
        videoConfig.token,
        this.channel,
        this.uidID,
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
            console.log(
              "New stream added:创建流1111111111111 " + stream.getId()
            );
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
            console.log("screen", remoteStream.getId());
            // _this.$store.commit("SET_stream", remoteStream);

               let arr = localStorage.getItem('localStreams')
              if(arr){
                arr = JSON.parse(localStorage.getItem('localStreams'))
              }else{
                arr=  []
              }
              

             

            let uid = remoteStream.getId();
            let id = "agora_remote" + remoteStream.getId();
            console.log('this.localStreams',this.localStreams)



            if (remoteStream.getId() == 666) {
              _this.remoteStreamDoMID666 = id;
              http
                .get("roomUpdateLayout", { name: _this.channel, uid })
                .then(res => {
                  console.log("通知后台播放旁路推流:", uid);
                });
              _this.$nextTick(() => {
                _this.$refs.video666.style.zIndex = 10;
                remoteStream.play(_this.remoteStreamDoMID666);
                _this.remoteStream = remoteStream;
              });

              return;
            } else if (remoteStream.getId() == 777 ) {
              if(!arr.includes(uid)){
                remoteStream.play("screen");
                return
              }
              return
            }
            _this.remoteStreamDoMID = id;
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

        // let dom = document.getElementById("agora_remote" + uid);
        // console.log("离开房间 ", "agora_remote" + uid);
        // if (uid == 666) {
        //   let domPlayer = document.getElementById("player_666");
        //   _this.$refs.video666.style.zIndex = -99;
        //   domPlayer && domPlayer.remove();
        //   return;
        // }
        // dom && dom.remove();
          
        let domPlayer = document.getElementById("player_"+uid);
        console.log('player_',domPlayer,uid)
        domPlayer && domPlayer.remove();
      });
      // 删除流后删除dom,(结束屏幕分享触发)
       _this.client.on("stream-removed", function(evt) {
        var stream = evt.stream;
        let domPlayer = document.getElementById("player_"+stream.getId());
        console.log('player_',domPlayer,stream.getId())
        domPlayer && domPlayer.remove();
        // 
        _this.unShare()
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
    stopClick() {
      this.room.dispatchMagixEvent("stop", {});
      console.log("触发自定义事件: stop");
    },
    playClick() {
      this.room.dispatchMagixEvent("play", {});
      console.log("触发自定义事件: play");
    },
    shareSreen() {
      let { appID, mode, codec } = videoConfig;
      let channel = this.channel;
      let screenStream;
      const _this =this

      var localStreams = [];

      var screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      
      screenClient.init(appID, function() {
        screenClient.join(
          videoConfig.token,
          channel,
          777,
          function(uid) {
            // 保存本地流的uid
            localStreams.push(uid);
            console.log("screen", uid);
            localStorage.setItem('localStreams',JSON.stringify(localStreams))
            // 创建屏幕共享流
            screenStream = AgoraRTC.createStream({
              streamID: uid,
              audio: false, // 设置屏幕共享不带音频，避免订阅端收到的两路流中都有音频，导致回声
              video: false,
              screen: true,
              // Chrome
              // extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg',
              // Firefox
              mediaSource: "window" // 'screen', 'application', 'window'
            });
            // 初始化流
            screenStream.init(
              function() {
                // 播放流
                screenStream.play("screen");
                // 推流
                screenClient.publish(screenStream);
                screenClient.on("stream-published", function(evt) {
                  console.log(
                    "屏幕分享流成功!!!!!!!"
                  );
                });

                // 监听流（用户）加入频道事件
                screenClient.on("stream-added", function(evt) {
                  var stream = evt.stream;
                  var uid = stream.getId();

                  // 收到流加入频道的事件后，先判定是不是本地的uid
                  if (!localStreams.includes(uid)) {
                    console.log("subscribe stream:" + uid);
                    // 拉流
                    screenClient.subscribe(stream);
                  }
                });
                // screenClient.on("stream-subscribed", function(evt) {
                //     var remoteStream = evt.stream;
                //     console.log('本地订阅了')
                //     if (remoteStream.getId() == 777) {
                //       remoteStream.play("screen");
                //       return
                //     }
                //   })
              },
              (err)=> {
                console.log(1111, err);
                _this.unShare()
              }
            );
          },
          function(err) {
            console.log(222,err);
            
          }
        );
      });
      this.screenClient = screenClient
    },
    unShare() {
       this.screenClient.leave(
          function() {
            console.log("Leave channel successfully");
          },
          function(err) {
            console.log("Leave channel failed");
          }
        );
    }
  }
};
</script>
<style lang="less" scoped>
#agora_local {
  width: 100%;
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
  // max-width: 1200px;
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
#player_666 {
  display: flex;
  justify-content: center;
}
#video666 {
  // width: auto!important;
  max-width: 1000px;
  height: auto !important;
}
#screen {
  position: fixed;
  top: 0px;
  left: 0;
  z-index: 10;
  width: 80%;
  height: 88vh;
  // border: 1px solid #333;
}
</style>

