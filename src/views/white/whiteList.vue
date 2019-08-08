<template>
  <div class="white-ist">
    123432
  </div>
</template>

<script>
export default {
  inject: ['whiteJoin'],
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.init()
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
.white-ist{
  position: fixed;
  right: 0;
  top: 10px;
  z-index: 33;
  background-color: rgb(241, 243, 244);
}
</style>

