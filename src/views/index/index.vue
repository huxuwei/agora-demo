<template>
  <div class="page-box">
    <div class="page-box-left">
      <div class="page-box-left-mid">
        <el-input class="room-input" 
          placeholder="房间号" v-model="room"></el-input>
        <el-button class="room-join" @click="join">进入房间</el-button>
      </div>
    </div>
    <div class="page-box-right"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      room: ''
    }
  },
  methods: {
    join() {
      this.$store.commit('SET_videoRoom', this.room)
      this.$router.push('/home')
    }
  },
}
</script>

<style lang='less' scoped>
.page-box{
  display: flex;
  height: 100vh;
  >div{
    flex-basis: 50%;
    height: 100%;
  }
  .page-box-left{
    display: flex;
    justify-content: center;
    align-items: center;
    .page-box-left-mid{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 360px;
      height: 320px;
      box-shadow: 0 0 16px #e7eaee;
      .room-input{
        width: 200px;
      }
      .room-join{
        width: 200px;
        margin-top:20px;
        background-color: #5b908e;
        color: #fff;
      }
    }
  }
  .page-box-right{
    background: url('~@/assets/images/name_bg.jpg') no-repeat scroll 50%;
  }
  .btn{
    line-height: 1.499;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
  }
}
</style>
