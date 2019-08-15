<template>
  <div class="file-list">
    <header class="file-list-header">
      <div v-for="(item,i) in headerList"
        :key="i"
        @click="activeIndex = i"
        :class="{active: i === activeIndex}"
        ><span>{{item}}</span></div>
    </header>
    <main class="file-list-main">
      <file-item-static v-show="activeIndex == 0"></file-item-static>
      <file-item v-show="activeIndex == 1"></file-item>
    
    </main>
  </div>
</template>

<script>
import FileItem from './item'
import FileItemStatic from './fileItem'
export default {
  components:{FileItem, FileItemStatic},
  inject: ['whiteJoin'],
  data() {
    return {
      headerList: ['课件库','媒体库'],
      activeIndex: 0,
      list: []
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    init() {
      let scenceState = this.whiteJoin.room.state.sceneState;
      console.log(scenceState.scenes)
    }
  }
}
</script>

<style lang="less" scoped>
.file-list{
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  min-width: 300px;
  z-index: 33;
  background-color: #28292f;
  .file-list-header{
    display: flex;
    margin-top: 10px;
    >div{
      width: 100px;
      border-radius: 12px;
      color: #8c8c93;;
      background-color: white;
      margin-left: 10px;
      text-align: center;
      line-height: 24px;
      cursor: pointer;
    }
    .active{
      background-color: #07f;
      span{
        color: white;
      }
    }
  }
  .file-list-main{
    margin: 20px;
  }
}
</style>

