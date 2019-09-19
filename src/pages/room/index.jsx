/* eslint-disable no-useless-constructor */

import React, { useState, useEffect  } from 'react'
import './index.less'
import VideoRoom from '@/pages/video'
import WhiteRoom from '@/pages/white'
import RoomHeader from '@/pages/header/index'
import {msgLogin } from '@/utils/chatAction.js'
import { connect } from "react-redux";

class Room extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      classStatus: false
    }
  }
  componentDidMount() {
    const {agora: {appId, rtmToken, uid},status } = this.props.roomInfo
    const msgClient = msgLogin({
      appID: appId,
      token: rtmToken,
      uid: uid+''
    })
    this.props.Set_msgClient(msgClient)
    // 判断课程状态
    this.setState({
      classStatus: status !== 1 ? false: true
    })
  }
  startClass=(val)=> {
    this.setState({
      classStatus: val
    })
  }
  render() {
    const {roomInfo} = this.props
    return (
      <div className="room-page">
        <div className='room-page-header'>
          <RoomHeader roomInfo={roomInfo} startClass={(val)=>{this.startClass(val)}} ></RoomHeader>
        </div>
        <div className="room-page-main">
          <div className="room-page-left">
            {
              // this.state.classStatus && 
              <WhiteRoom roomInfo={roomInfo} classStatus={this.state.classStatus}></WhiteRoom>
            }
          </div>
          <div className="videoWrap">
            <VideoRoom  roomInfo={roomInfo}></VideoRoom>
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch){
  return {
    Set_msgClient: (msgClient)=>dispatch({type:'Set_msgClient', payload:msgClient}),
    Set_channel: (payload)=> dispatch({type: 'Set_Channel', payload})
  }
}
export default connect(null,mapDispatchToProps)(Room)