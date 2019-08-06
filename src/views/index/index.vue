<template>
  <div class="page-box">
    <div class="page-box-left">
      <div class="page-box-left-mid">
        <div>
          <el-input class="room-input" 
            placeholder="房间号" v-model="room"></el-input>
          <el-button class="room-join" @click="create">加入房间</el-button>
          <el-button class="room-join" @click="replay">回放</el-button>
        </div>
      </div>
    </div>
    <div class="page-box-right"></div>
  </div>
</template>

<script>
import http from '@/utils/request'
export default {
  data() {
    return {
      room: '',
      roomJoin: '',
      roomInfo: {},
      uuid: ''
    }
  },
  methods: {
    create() {

      http.get('roomName',{name:this.room}).then(res=>{
        console.log('res',res.data)
        let {herewhite, agora  } = res.data
        this.roomInfo = {
          uuid: herewhite.uuid,
          roomName: agora.name
        }

        this.$store.commit('SET_roomInfo', this.roomInfo)
        this.$router.push({
          path: 'home',
          query: {
            uuid: this.roomInfo.uuid,
            roomName: this.roomInfo.roomName
          }
        })
      })
      
    },
    join() {
      // this.$store.commit('SET_roomInfo', this.roomJoin)
      // this.$router.push('/home')
    },
    replay() {
      http.get('roomInfo',{name:this.room}).then(res=>{
        // console.log('res',res.data)
        let {roomToken, uuid  } = res.data
        // this.roomInfo = {
        //   uuid: herewhite.uuid,
        //   roomName: agora.name
        // }

        this.$store.commit('SET_roomInfo', this.roomInfo)
        this.$router.push({
          path: 'replay',
          query: {
            uuid,roomToken
            // roomName: this.roomInfo.name,
            // roomToken: 
          }
        })
      })
      // this.$router.push({
      //   path: '/replay',
      //   query: {
      //     uuid: this.uuid,
      //   }
      // })
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
      >div{
        display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      }
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
