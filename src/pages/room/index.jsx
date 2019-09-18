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
  }
  componentDidMount() {
    const {appId, rtmToken, uid} = this.props.roomInfo.agora
    const msgClient = msgLogin({
      appID: appId,
      token: rtmToken,
      uid: uid+''
    })
    this.props.Set_msgClient(msgClient)
  }
  
  render() {
    const {roomInfo} = this.props
    return (
      <div className="room-page">
        <div className='room-page-header'>
          <RoomHeader roomInfo={roomInfo} ></RoomHeader>
        </div>
        <div className="room-page-main">
          <div className="room-page-left">
            <WhiteRoom roomInfo={roomInfo}></WhiteRoom>
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
    Set_msgClient: (msgClient)=>dispatch({type:'Set_msgClient', payload:msgClient})
  }
}
export default connect(null,mapDispatchToProps)(Room)