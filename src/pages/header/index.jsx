import React, {useState, useEffect} from 'react';
import {Button, message, Drawer } from 'antd'
import http from '@/utils/request'
import GIcon from '@/components/GIcon'
import './index.less'
import FileList from './fileList'
import Chatting from './chat'
import {info, createChannel, sendMessage} from './chat/chatInit'
import {  videoConfig } from "@/utils/config.js";

function RoomHeader(props) {

  const [classStatus, setClassStatus] = useState(false)
  const [classStartLoading, setclassStartLoading] = useState(false)
  const [drawVisible, setDrawVisible] = useState(true)
  const [active, setActive] = useState({})
  const [roomName, setroomName] = useState('')
  const [msg, setMsg] = useState('')
  const buttonList = [
    {type: 'file',icon:'iconziyuan'},
    {type: 'chat',icon:'iconliaotian'},
    {type: 'dashed'},
    {type: 'danger'},
    {type: 'primary'},
  ]
  useEffect(()=>{
    const {channel } = props.roomInfo.agora
    setroomName(channel)
  },[])
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
    setActive(item)
  }
  function drawClose() {
    setDrawVisible(false)
  }
  function chooseShow(val){
    // switch(active.type){
    //   case 'file': return <FileList ></FileList>;
    //   case 'chat': return <Chatting msg={msg}></Chatting>;
    //   default : return null
    // }
    if(active.type === val){
      return 'visibility:hidden'
    }
    switch(active.type){
      case 'file': return <FileList ></FileList>;
      case 'chat': return <Chatting msg={msg}></Chatting>;
      default : return null
    }
  }
  return (
    <React.Fragment>
      <div className="room-info">
        <span>房间号：{roomName}</span>
      </div>
      <div className="room-action">
        {buttonList.map((item, i)=>(
          <div className='action-wrap' onClick={ ()=>showDraw(item,i) } key={i+1}>
            <Button type='default' shape="circle">
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
          
          <Chatting className={chooseShow('chat')} comDidMouted={drawClose} agora={props.roomInfo.agora}></Chatting>;
          {/* {chooseShow()} */}
        </Drawer>
    </React.Fragment>
  )
}

export default RoomHeader