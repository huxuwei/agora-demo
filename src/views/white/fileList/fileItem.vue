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
      activeIndex: 0
    }
  },
  computed:{
    list() {
      return this.$store.getters.fileListStatic
    },
    whiteWebSdk() {
      return this.$store.state.whiteWebSdk
    },
    roomToken() {
      return localStorage.getItem("roomToken");
    },
    room() {
      return this.$store.state.whiteRoom
    },
    
  },
  methods: {
    choose(item, i){
       this.activeIndex = i
       this.pptShow(item)
    },
    pptShow(item,i) {
      //之前初始化的 sdk 实例，roomToken 创建房间时，具体房间的 roomToken，此处作为鉴权使用。
      // console.log("wqwe", this.whiteWebSdk.pptConverter);
      let {url } = item
      console.log('item,', item)
      var pptConverter = this.whiteWebSdk.pptConverter(this.roomToken);
      pptConverter.convert({
          url: url,
          // url: 'http://pvsytwo44.bkt.clouddn.com/ppt.ppt',
          kind: "static"
        })
        .then(result => {
          // scenes 就是用来创建 pptx 对应的场景的描述信息
          var scenes = result.scenes;

          // 为这个 ppt 文件起一个独一无二的名字。
          // 如果你的白板中可能出现多个 ppt，这样有助于管理它们。
          var pptName = i;

          // // 将 ppt 对应的场景插入白板
          this.room.putScenes("/" + pptName, scenes);
          console.log("pppp:", "/" + pptName, scenes);
          // 切换当前场景到 ppt 的第一页，这样才能显示出来
          this.room.setScenePath("/" + pptName + "/" + scenes[0].name);
        });
    },
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
