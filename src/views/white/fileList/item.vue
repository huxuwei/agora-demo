<template>
  <div class="file-list-item-wrap">
    <div
      class="file-list-item"
      v-for="(item,i) in list"
      :key="i"
      :class="{active: i==activeIndex}"
      @click="choose(item,i)"
    >
      <span>{{item.name}}</span>
    </div>
    <!-- <div class="video666" ref="video666" id="agora_remote666"></div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      activeURL: "flv.flv",
      activeItem: {},
      tempItem: {},
      tempIndex: -1,
      firstLoad: true
    };
  },
  computed: {
    client() {
      return this.$store.state.client;
    },
    stream() {
      return this.$store.state.stream;
    },
    list() {
      return this.$store.getters.fileListMedia;
    }
  },
  mounted() {
    this.client.on('peer-online', (evt)=>{
      console.log("peer-online", evt);
    })
    this.client.on('first-audio-frame-decode', (evt)=>{
      // var remoteStream = evt.stream;
      // console.log("first-audio-frame-decode", remoteStream, remoteStream.getId());
      // var id = 'agora_remote' + remoteStream.getId()
      // if(remoteStream.getId() == 666) {
      //   // _this.$nextTick(()=>{
      //   //   _this.videoDivList.push(id)
      //   // })
      //   // _this.videoDivList666.push(id)
      //   this.$nextTick(()=>{
      //     remoteStream.play(id);
      //   })
      //     return
      //   }
    })
    
    this.client.on("peer-leave", ()=> {
    // this.client.on("liveStreamingStopped", ()=> {

        console.log("停止视频播放");

        this.stream.stopAudioMixing(() => {
          console.log("停止音频播放");
          this.stopCallback()
        })
    })
  },
  methods: {
    stopCallback() {
      this.activeIndex = this.tempIndex;
      this.activeItem = Object.assign({},this.tempItem)
      this.activeURL = this.tempItem.url;
      if (this.activeItem.suffix == "mp3") {
        console.log("item.url ", this.tempItem.url);
        this.stream.startAudioMixing(
          {
            playTime: 0,
            filePath: this.tempItem.url
          },
          function(error) {
            if (error) {
              // 错误处理
              console.log("音频播放错误:" + error);
              return;
            }
          }
        );
      } else {
        var InjectStreamConfig = {
          width: 0,
          height: 10,
          videoGop: 30,
          videoFramerate: 15,
          videoBitrate: 400,
          audioSampleRate: 44100,
          audioChannels: 1
        };
        console.log('进入第一次播放视频',this.firstLoad)
        this.client.addInjectStreamUrl(this.activeURL, InjectStreamConfig);
      }
    },
    choose(item, i) {
      this.tempItem = Object.assign({},item)
      this.tempIndex = i
      
      if(this.firstLoad) {
        console.log('进入第一次播放')
        this.stopCallback()
        this.firstLoad = false
        return
      }
      if(this.activeItem.suffix == "mp3"){
         this.stream.stopAudioMixing(() => {
          console.log("停止音频播放");
          this.stopCallback()
        })
      }else{
        this.client.removeInjectStreamUrl(this.activeURL);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.file-list-item-wrap {
  .file-list-item {
    margin-top: 14px;
    cursor: pointer;
    > span {
      color: white;
    }
  }
  .active {
    > span {
      color: red;
    }
  }
}
</style>

