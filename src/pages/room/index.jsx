/* eslint-disable no-useless-constructor */

import React, { useState, useEffect  } from 'react'
import './index.less'
import VideoRoom from '@/pages/video'
import WhiteRoom from '@/pages/white'
import RoomHeader from '@/pages/header/index'
import '@/utils/clientTest.js'

export default function Room(props) {
  const roomInfo = props.roomInfo
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