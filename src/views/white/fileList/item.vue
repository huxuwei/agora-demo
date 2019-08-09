<template>
  <div class="file-list-item-wrap">
    <div class="file-list-item" 
      v-for="(item,i) in list"
      :key="i"
      :class="{active: i==activeIndex}"
      @click="choose(item,i)">
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      activeURL :'',
      activeItem: {}
    }
  },
  computed:{
    client() {
      return this.$store.state.client
    },
    stream() {
      return this.$store.state.stream
    },
    list() {
      return this.$store.getters.fileListMedia
    }
  },
  mounted() {
    this.client.on("peer-leave",function () {
      console.log('停止视频播放')
    })
  },
  methods: {
    stopMediaPlay() {
      return new Promise((reslove, reject)=>{
        this.client.on("peer-leave",function () {
          reslove()
          console.log('停止视频播放')
        })
      })
    },
    stopAudioMixing(){
      return new Promise((resolve, reject)=>{
        this.stream.stopAudioMixing(()=>{
          resolve()
          console.log('停止音频播放')
        })
      })
    },
    async choose(item,i) {
      
      // this.stream.stopAudioMixing(()=>{
      //   console.log('停止音频播放')
      // })
      
      if(item.suffix == 'mp3') {
        await this.stopAudioMixing()
      }else{
        this.activeURL && this.client.removeInjectStreamUrl(this.activeURL);
      }
      
      await this.stopMediaPlay()
      
      this.activeIndex = i
      this.activeItem = item
      this.activeURL = item.url
      if(item.suffix == 'mp3') {
        console.log('item.url ',item.url)
        this.stream.startAudioMixing({
          playTime: 0,
          filePath: item.url
        }, function(error) {
            if (error) {
                // 错误处理
                console.log('音频播放错误:'+error)
                return;
            }
            // 播放成功后的流程
        });
      }else{
        var InjectStreamConfig = {
          width: 300,
          height: 300,
          videoGop: 30,
          videoFramerate: 15,
          videoBitrate: 400,
          audioSampleRate: 44100,
          audioChannels: 1,
        };
        this.client.addInjectStreamUrl(item.url, InjectStreamConfig);
      }
      
    }
  },
}
</script>

<style lang="less" scoped>
.file-list-item-wrap{
  .file-list-item{
    margin-top: 14px;
    cursor: pointer;
    >span{
      color: white;
    }
  }
  .active{
    >span{
      color: red;
    }
  }
}

</style>

