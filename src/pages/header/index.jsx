import React, {useState} from 'react';
import queryString from 'query-string'
import {Button, message, Drawer } from 'antd'
import http from '@/utils/request'
import GIcon from '@/components/GIcon'
import './index.less'
import FileList from './fileList'
import Chatting from './chat'

function RoomHeader(props) {
  const room = queryString.parse(window.location.hash.split('?')[1]).room

  const [classStatus, setClassStatus] = useState(false)
  const [classStartLoading, setclassStartLoading] = useState(false)
  const [drawVisible, setDrawVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const buttonList = [
    {type: 'default',icon:'iconziyuan'},
    {type: 'ghost'},
    {type: 'dashed'},
    {type: 'danger'},
    {type: 'primary'},
  ]

  function start() {
    setclassStartLoading(true)
    const api =  classStatus ? 'roomStop':'roomStart'
    // const 
    http.get(api, { name: room, startTime: 1 }).then(res => {
      message.success('开始上课')
      setclassStartLoading(false)
      setClassStatus(!classStatus)
      // sendMessage('start')
    }).catch(err=>{
      setclassStartLoading(false)
    })
    
  }
  function showDraw(item, i) {
    setDrawVisible(!drawVisible)
    setActiveIndex(i)
  }
  function drawClose() {
    setDrawVisible(false)
  }
  return (
    <React.Fragment>
      <div className="room-info">
        <span>房间号：{room}</span>
      </div>
      <div className="room-action">
        {buttonList.map((item, i)=>(
          <div className='action-wrap' onClick={ ()=>showDraw(item,i) } key={item.type}>
            <Button type={item.type} shape="circle">
              <GIcon icon={item.icon}></GIcon>
            </Button>
          </div>
        ))}

        <Button type='primary' loading={classStartLoading} onClick={start}>{classStatus ? '下课':'上课'}</Button>
      </div>
      <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          // mask={false}
          width='30%'
          title=''
          onClose={drawClose}
          visible={drawVisible}
        >
          {/* <FileList></FileList> */}
          {/* <Chatting></Chatting> */}
        </Drawer>
    </React.Fragment>
  )
}

export default RoomHeader