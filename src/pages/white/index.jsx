import React from 'react'
import './index.less'
import { ViewMode } from "white-web-sdk";
import {videoConfig} from '@/utils/config.js'
import http from '@/utils/request'
import queryString from 'query-string'
import { connect } from "react-redux";
import WhiteTools from './whiteTools'

class White extends React.Component{
  constructor(props){
    super(props)
    this.channel = queryString.parse(window.location.hash.split('?')[1]).room
    this.state = {

    }
    
  }

  componentDidMount() {
    // this.initAndJoinRoom()
    
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", () => {
      if (this.room) {
        this.room.refreshViewSize &&this.room.refreshViewSize();
      }
    });
  }

  init() {
    const {uuid} = this.props

    const that = this;
    var sdkToken = whiteConfig.token;
    var url = `https://cloudcapiv4.herewhite.com/room/join?token=${sdkToken}&uuid=${uuid}`;
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
        // that.$message.success('通知： 上课了')
        // that.classStartLoading = false
        that.classStatus = that.status
        that.room = room;
        that.readOnly();
        // that.room.setMemberState({
        //   currentApplianceName: 'selector'
        // });
        // 
        // 设置成主播
        that.teachRole && room.setViewMode("broadcaster");
        // 禁止缩放
        room.disableCameraTransform='YES'
        // 设置初始颜色
        room.setMemberState({
          strokeColor: [255, 0, 0],
        });
        that.addRoomEvent()
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  initAndJoinRoom(roomToken) {
    let {room } = this
    // 初始化 SDK，并且调用其成员方法 joinRoom
    this.whiteWebSdk = new WhiteWebSdk();
    // this.$store.commit('SET_whiteWebSdk', this.whiteWebSdk)
    room =  this.whiteWebSdk.joinRoom({
      uuid: this.uuid,
      roomToken: roomToken
    });
    
    room.bindHtmlElement(this.refs.whiteWrap);

    // 白板自适应
    room.refreshViewSize();
     // 设置成主播
     this.role === 1 && room.setViewMode("broadcaster");
     // 禁止缩放
     room.disableCameraTransform='YES'
     // 设置初始颜色
     room.setMemberState({
       strokeColor: [255, 0, 0],
     });
     this.readOnly()
     this.addRoomEvent()
     
     this.props.Set_whiteRoom(room)
  }
  readOnly() {
    //只读，再设置为跟随
    if (this.role == 2) {
      this.room.disableOperations = true;
      this.room.setViewMode(ViewMode.Follower);
    }
  }
  addRoomEvent() {
    // this.room.addMagixEventListener('claaStart',this.message('开始上课啦')) ;
    this.room.addMagixEventListener('claaStop', this.classStop);
    this.room.addMagixEventListener('stop', this.stop);
    this.room.addMagixEventListener('play', this.play);
  }
  changeTool(val){
    console.log(val)
    // this.room.setMemberState({
    //   currentApplianceName: val
    // });
  }

  render() {
    const {changeTool} = this
    return (
      <div className="white-wrap">
        <div className="wrap" ref="whiteWrap"></div>
        <WhiteTools changeTool={changeTool}></WhiteTools>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    n: state.n,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    add1: ()=> dispatch({type:'add', payload: 1}),
    Set_whiteRoom: (whiteRoom)=> dispatch({type: 'Set_whiteRoom', payload: whiteRoom})
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(White)