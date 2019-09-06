<template>
  <div class="white-wrap">
    <div class="wrap" ref="whiteWrap"></div>
    
    <template v-if="teachRole">
     
      <el-button @click="start" :loading="classStartLoading" v-if="classStatus == 0">上课</el-button>
      <template v-if="classStatus == 1">
        <!-- <WhiteTool class="white-tools" @changeTool="changeTool"></WhiteTool> -->
         
        <el-button @click="ended">下课</el-button>
        <el-button @click="shareSreen">屏幕共享</el-button>
        <!-- <el-button @click="pptShow">ppt</el-button> -->
        <!-- <el-button @click="pptPre">上一页</el-button>
        <el-button @click="pptNext">下一页</el-button>
        <el-button @click="createWhite">新建白板</el-button> -->
        <el-button @click="whiteListVisible = !whiteListVisible">课件库</el-button>
      </template>
      <!-- <el-button @click="showSceneState">当前场景信息</el-button> -->
      
    </template>
    <FileList v-show="whiteListVisible"></FileList>
  </div>
</template>

<script>
import { whiteConfig, classStatus, videoConfig } from "@/utils/config.js";
import WhiteTool from "./tools";
import http from "@/utils/request";
import axios from "axios";
import { ViewMode } from "white-web-sdk";
import FileList from "./fileList";
import {info, createChannel, sendMessage} from '@/utils/info.js'
import AgoraRTM from 'agora-rtm-sdk'
var n = 0;
export default {
  components: { WhiteTool, FileList },
  props:['uidID'],
  data() {
    return {
      room: {},
      whiteWebSdk: {},
      // uuid: "",
      whiteListVisible: false,
      classStatus: classStatus.noClass,
      classStartLoading: false
    };
  },
  mounted() {
    this.initInfo()
    this.init()
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", () => {
      if (this.room) {
        this.room.refreshViewSize &&this.room.refreshViewSize();
      }
    });
   
  },
  computed: {
    uuid() {
      return localStorage.getItem("uuid");
    },
    name() {
      return localStorage.getItem("name");
    },
    role() {
      return localStorage.getItem("role");
    },
    roomToken() {
      return localStorage.getItem("roomToken");
    },
    teachRole() {
      return this.$route.query.role == 1;
    },
    client() {
      return this.$store.state.client;
    },
    ws() {
      return this.$store.state.ws;
    },
    channel() {
      return this.$route.query.room;
    },
  },
  provide() {
    return {
      whiteJoin: this
    };
  },
  methods: {
    getRoomInfo() {
      http.get("roomInfo", { name: this.name }).then(res => {
        let { status } = res.data;
        if (status == 1) {
        }
      });
    },
    init() {
      const that = this;
      var sdkToken = whiteConfig.token;
      var url = `https://cloudcapiv4.herewhite.com/room/join?token=${sdkToken}&uuid=${this.uuid}`;
      var requestInit = {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: "我的第一个 White 房间",
          limit: 6 // 房间人数限制
        })
      };

      // 请求加入房间
      // 请求创建房间（网络请求部分逻辑，请在服务器实现）
      fetch(url, requestInit)
        .then(function(response) {
          // Step1: 服务器返回进入房间的秘钥 roomToken
          return response.json();
        })
        .then(function(json) {
          // Step2: 加入房间
          return that.initAndJoinRoom(json);
        })
        .then(function(room) {
          // Step3: 加入成功后想白板绑定到指定的 dom 中
          room.bindHtmlElement(that.$refs.whiteWrap);
          room.refreshViewSize();
          that.$message.success('通知： 上课了')
          // room.setMemberState({
          //     strokeColor: [104, 33, 197],
          // });
          that.classStartLoading = false
          that.classStatus = classStatus.inClass
          console.log(33333333333,that.classStatus , classStatus.inClass)
          that.room = room;
          that.readOnly();
          that.$store.commit('SET_whiteRoom', room)
          // that.room.setMemberState({
          //   currentApplianceName: 'selector'
          // });
          that.addRoomEvent()
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    initAndJoinRoom(json) {
      // 初始化 SDK，并且调用其成员方法 joinRoom
      this.whiteWebSdk = new WhiteWebSdk();
      this.$store.commit('SET_whiteWebSdk', this.whiteWebSdk)
      return this.whiteWebSdk.joinRoom({
        uuid: this.uuid,
        roomToken: json.msg.roomToken
      });
    },
    changeTool(val) {
      this.room.setMemberState({
        currentApplianceName: val
      });
    },
    
    pptShow() {
      //之前初始化的 sdk 实例，roomToken 创建房间时，具体房间的 roomToken，此处作为鉴权使用。
      console.log("wqwe", this.whiteWebSdk.pptConverter);
      var pptConverter = this.whiteWebSdk.pptConverter(this.roomToken);
      pptConverter.convert({
          // url: "https://live.boluozaixian.net/ppt.ppt",
          url: 'http://pvsytwo44.bkt.clouddn.com/ppt.ppt',
          kind: "static"
        })
        .then(result => {
          // scenes 就是用来创建 pptx 对应的场景的描述信息
          var scenes = result.scenes;

          // 为这个 ppt 文件起一个独一无二的名字。
          // 如果你的白板中可能出现多个 ppt，这样有助于管理它们。
          var pptName = "dynamic";

          // // 将 ppt 对应的场景插入白板
          this.room.putScenes("/" + pptName, scenes);
          console.log("pppp:", "/" + pptName, scenes);
          // 切换当前场景到 ppt 的第一页，这样才能显示出来
          this.room.setScenePath("/" + pptName + "/" + scenes[0].name);
        });
    },
    pptPre() {
      console.log("上一页");
      this.room.pptPreviousStep(); // 上一页（上一步）
    },
    pptNext() {
      console.log("下一页");
      this.room.pptNextStep(); // 下一页（下一步）
    },
    createWhite() {
      n++;
      var name = n;
      // 创建场景
      this.room.putScenes("/phy", [{ name }]);
      // 切换场景
      this.room.setScenePath("/phy/" + name);
      // 当前场景的状态
      let scenceState = this.room.state.sceneState;
      console.log("scenceState", scenceState);
    },
    setViewMode() {
      // console.log('111', this.whiteWebSdk.ViewMode, this.whiteWebSdk)
      console.log(111, ViewMode);
      this.room.setViewMode(ViewMode.Broadcaster);
    },
    readOnly() {
      //只读，再设置为跟随
      if (this.role == 2) {
        this.room.disableOperations = true;
        this.room.setViewMode(ViewMode.Follower);
      }
    },
    showSceneState() {
      let scenceState = this.room.state.sceneState;
      console.log('scenceState',scenceState)
    },

    addRoomEvent() {
      // this.room.addMagixEventListener('claaStart',this.message('开始上课啦')) ;
      this.room.addMagixEventListener('claaStop', this.classStop);
      this.room.addMagixEventListener('stop', this.stop);
      this.room.addMagixEventListener('play', this.play);
    },
    classStop() {
      this.client.leave(function () {
        console.log("离开房间成功");
      }, function (err) {
        console.log("Leave channel failed");
      });
      this.message('下课啦')
    },
    message(val){
      return ()=> {
        this.$message.success(val)
      }
    },

    stop() {
      console.log('接收远程自定义事件: stop')
      var video666 =  document.getElementById('video666')
      var audio666 =  document.getElementById('audio666')
      
      video666.pause()
      audio666.pause()
    },
    play() {
      console.log('接收远程自定义事件: play')
      var video666 =  document.getElementById('video666')
      var audio666 =  document.getElementById('audio666')
      video666.play()
      audio666.play()
    },
    /** */
    start() {
     
      let  msg= {
        classStart: 1
      }
      this.classStartLoading = true
      let teacherUserId = parseInt(Math.random()*100000000)
      let startTime = new Date().getTime();
      http.get("roomStart", { name: this.name, startTime, }).then(res => {
        this.$message.success('开始上课')
        this.classStartLoading = false
        this.classStatus = classStatus.inClass
        this.whiteListVisible = true
        sendMessage('start')
      });
      
    },
    ended() {
      let endTime = new Date().getTime();
      // this.room.dispatchMagixEvent('claaStop', {});
      http.get("roomStop", { name: this.name, endTime }).then(res => {
        this.$message.success('课程结束')
        sendMessage('end')
        setTimeout(() => {
          this.$parent.$children[1].unShare()
          this.$parent.$children[1].leaveRoom()
          
        }, 5000);
        
      });
    },
    shareSreen() {
      console.log(this.$parent.$children[1])
      this.$parent.$children[1].shareSreen()
    },
    initInfo(){
      console.log('this.uidID',this.uidID)
      let { appID, mode, codec } = videoConfig;
      let infoClient = info({
        appID,
        token: undefined,
        uid: this.uidID+'1'
      },(text)=>{
        console.log('回调成功',text,typeof text)
        if(text == 'start'){
          // this.$message.success()
          this.$message.success('开始上课!')
        }else if(text == 'end'){
          this.$message.success('下课啦!')
          setTimeout(() => {
            this.$parent.$children[1].unshare()
            this.$parent.$children[1].leaveRoom()
           
          }, 5000);
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.white-wrap {
  position: relative;
  height: 100%;
  .wrap {
    width: 100%;
    height: 90%;
    background-color: rgb(241, 243, 244);
  }
  .white-tools {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
