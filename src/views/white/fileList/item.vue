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
      this.activeItem = this.tempItem;
      this.activeURL = this.tempItem.url;
      if (this.tempItem.suffix == "mp3") {
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
        this.client.addInjectStreamUrl(this.tempItem.url, InjectStreamConfig);
      }
    },
    choose(item, i) {
      this.tempItem = item
      this.tempIndex = i
      console.log(item,i)
      if(this.firstLoad) {
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
        // this.client.stopLiveStreaming(this.activeURL)
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

