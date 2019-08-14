<template>
  <div class="file-list-item-wrap">
    <div
      class="file-list-item"
      v-for="(item,i) in list"
      :key="i"
      :class="{active: i==activeIndex}"
      @click="play(item,i)"
    >
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      activeURL: "",
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
    this.client.on("peer-leave", ()=> {
      console.log("停止视频播放");
      // if(this.activeURL == this.tempItem.url){
      //   return 
      // }
      // if(this.stream.stopAudioMixing  instanceof Function) {
      //   this.stream.stopAudioMixing(() => {
      //     console.log("停止音频播放");
      //     this.stopCallback()
      //   })
      // }else{
      //   this.stopCallback()
      // }
        
    })
  },
  methods: {
    play(item){
      var InjectStreamConfig = {
          width: 300,
          height: 300,
          videoGop: 30,
          videoFramerate: 15,
          videoBitrate: 400,
          // audioSampleRate: 44100,
          // audioChannels: 1
        };
        this.client.addInjectStreamUrl(item.url, InjectStreamConfig);
        console.log('添加视频流: addInjectStreamUrl')
    },
    // stopCallback() {
    //   this.activeIndex = this.tempIndex;
    //   this.activeItem = Object.assign({},this.tempItem)
    //   this.activeURL = this.tempItem.url;
    //   if (this.activeItem.suffix == "mp3") {
    //     console.log("item.url ", this.tempItem.url);
    //     this.stream.startAudioMixing(
    //       {
    //         playTime: 0,
    //         filePath: this.tempItem.url
    //       },
    //       function(error) {
    //         if (error) {
    //           // 错误处理
    //           console.log("音频播放错误:" + error);
    //           return;
    //         }
    //       }
    //     );
    //   } else {
    //     var InjectStreamConfig = {
    //       width: 300,
    //       height: 300,
    //       videoGop: 30,
    //       videoFramerate: 15,
    //       videoBitrate: 400,
    //       // audioSampleRate: 44100,
    //       // audioChannels: 1
    //     };
    //     this.client.addInjectStreamUrl(this.activeURL, InjectStreamConfig);
    //     console.log('添加视频流: addInjectStreamUrl')
    //     // this.client.addInjectStreamUrl('https://live.boluozaixian.net//test.mp4', InjectStreamConfig);
        
    //   }
    // },
    // choose(item, i) {
    //   this.tempItem = Object.assign({},item)
    //   this.tempIndex = i
      
    //   if(this.firstLoad) {
    //     console.log('进入第一次播放')
    //     this.firstLoad = false
    //     this.stopCallback()
        
    //     return
    //   }
    //   if(this.activeItem.suffix == "mp3"){
    //      this.stream.stopAudioMixing(() => {
    //       console.log("停止音频播放");
    //       this.stopCallback()
    //     })
    //   }else{
    //     console.log('开始停止视频')
    //     this.client.removeInjectStreamUrl(this.activeURL);
    //   }
    // }
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

