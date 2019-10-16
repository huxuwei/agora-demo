/* eslint-disable no-useless-constructor */

import React from 'react'
import './index.less'
import VideoRoom from '@/pages/video'
import WhiteRoom from '@/pages/white'
import RoomHeader from '@/pages/header/index'
import {msgLogin } from '@/utils/chatAction.js'
import { connect } from "react-redux";
import http from '@/utils/request'
import {roomConfig } from '@/utils/config'
import {Modal, Button } from 'antd'

class Room extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      classStatus: false,
      onlyStateus: true,
    }
  }
  componentDidMount() {
    // 登陆消息模块
    const {agora: {appId, rtmToken, uid},status } = this.props.roomInfo
    const msgClient = msgLogin({
      appID: appId,
      token: rtmToken,
      uid: uid+'',
      aborted: ()=>{
        this.setState({
          onlyStateus: false
        })
      }
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
        {
          this.state.onlyStateus ?
          <React.Fragment>
            <div className='room-page-header'>
              <RoomHeader roomInfo={roomInfo} startClass={(val)=>{this.startClass(val)}} ></RoomHeader>
            </div>
            <div className="room-page-main">
              <div className="room-page-left">
                <WhiteRoom roomInfo={roomInfo} classStatus={this.state.classStatus}></WhiteRoom>
              </div>
              <div className="videoWrap">
                <VideoRoom  roomInfo={roomInfo}></VideoRoom>
              </div>
            </div>
          </React.Fragment> : 
          <Modal
            title="提示"
            visible={true}
            okText='确认'
            cancelText={null}
            footer={null}
          >
            <h1>有相同用户进入教室,您已离开教室!</h1>

          </Modal>
        }
        
        
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