/* eslint-disable no-useless-constructor */

import React, { useState } from 'react'
import './index.less'
import VideoRoom from '@/pages/video'
import WhiteRoom from '@/pages/white'
import RoomHeader from '@/pages/header/index'
import http from '@/utils/request'
import queryString from 'query-string'
import '@/utils/clientTest.js'

export default function Room(props) {
  init()
  let [roomInfo, setRoomInfo] = useState()
  function init() {
    const { room, role } = queryString.parse(window.location.hash.split('?')[1])

    http.get("roomName", { name: room, role }).then(res => {

      let { agora, file } = res.data;
      setRoomInfo({
        uid: agora.uid,
        ch: agora.name,
        role: role
      })
      for (const key in roomInfo) {
        localStorage.setItem(key, roomInfo[key])
      }
    });
  }
  return (
    <div className="room-page">
      <div className='room-page-header'>
        <RoomHeader props={props}></RoomHeader>
      </div>
      <div className="room-page-main">
        <div className="room-page-left">
          <WhiteRoom></WhiteRoom>
        </div>
        <div className="videoWrap">
          {/* <VideoRoom  props={props}></VideoRoom> */}
        </div>
      </div>
    </div>
  )
}