import React , {useState, useEffect} from 'react'
import http from '@/utils/request'
import './index.less'
import Room from '@/pages/room'
import queryString from 'querystring'
import {Spin } from 'antd'

export default function LoadingStart(props) {
  let [roomInfo, setRoomInfo] = useState({})
  let [loading, setLoading] = useState(true)
  useEffect(()=>{
    init()
  },[])
  function init() {
    const { scheduleStr, crmUserStr, roleStr } = queryString.parse(window.location.hash.split('?')[1])
    const params = {
      scheduleStr,
      crmUserStr,
      roleStr
    }
    http.get("joinRoom", params).then(res => {
      setRoomInfo(res.data)
      // for (const key in roomInfo) {
      //   localStorage.setItem(key, roomInfo[key])
      // }
      setLoading(false)
    });
  }
  return (
    <div className='loading-start'>
        {
          loading ? <Spin spinning={loading}/> : <Room roomInfo={roomInfo}></Room>
        }
    </div>
  )
}