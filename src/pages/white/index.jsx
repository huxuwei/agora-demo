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
    this.first = true
  }

  componentDidMount() {
    this.initAndJoinRoom(this.props)
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", () => {
      if (this.room) {
        this.room.refreshViewSize &&this.room.refreshViewSize();
      }
    });
  }
  async initAndJoinRoom(nextProps) {
    
    const {roomToken, uuid} = nextProps.roomInfo.hereWhite
    // 初始化 SDK，并且调用其成员方法 joinRoom
    const whiteWebSdk = new WhiteWebSdk();
    // this.$store.commit('SET_whiteWebSdk', this.whiteWebSdk)
    this.room = await  whiteWebSdk.joinRoom({
      uuid,
      roomToken
    });
    let {room} = this
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
  changeTool = (val)=>{
    this.room.setMemberState({
      currentApplianceName: val
    });
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