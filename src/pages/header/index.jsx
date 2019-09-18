import React, {useState, useEffect} from 'react';
import {Button, message, Drawer, Badge  } from 'antd'
import http from '@/utils/request'
import GIcon from '@/components/GIcon'
import './index.less'
import FileList from './fileList'
import Chatting from './chat'

function RoomHeader(props) {

  const [classStatus, setClassStatus] = useState(false)
  const [classStartLoading, setclassStartLoading] = useState(false)
  const [drawVisible, setDrawVisible] = useState(true)
  const [active, setActive] = useState({type:'chat'})
  const [roomName, setroomName] = useState('')
  let [msgNum, setMsgNum] = useState(0)


  const buttonList = [
    {type: 'file',icon:'iconziyuan'},
    {type: 'chat',icon:'iconliaotian'},
    // {type: 'dashed'},
    // {type: 'danger'},
    // {type: 'primary'},
  ]
  useEffect(()=>{
    const {agora:{channel}, status } = props.roomInfo
    setroomName(channel)
    if(status === 1){
      setClassStatus(true)
    }
  },[])
  function start() {
    setclassStartLoading(true)
    const api =  classStatus ? 'roomStop':'roomStart'
    const { id: roomId, userInfo: { id:userId}} = props.roomInfo
    http.get(api, { roomId, userId }).then(res => {
      // message.success('开始上课')
      setclassStartLoading(false)
      setClassStatus(!classStatus)
      // sendMessage('start')
    }).catch(err=>{
      setclassStartLoading(false)
      // setClassStatus(!classStatus)
    })
    
  }
  function showDraw(item, i) {
    setDrawVisible(!drawVisible)
    setActive(item)
    if(item.type ==='chat'){
      setMsgNum(0)
    }
  }
  function drawClose() {
    setDrawVisible(false)
  }
  function chooseShow(val){
    if(active.type === val){
      return {
        display:'block',
        height: '100%'
      }
    }else{
      return {
        display:'none',
        height: '100%'
      }
    }
    switch(active.type){
      case 'file': return <FileList ></FileList>;
      case 'chat': return <Chatting msg={msg}></Chatting>;
      default : return null
    }
  }
  function getMessage(val) {
    setMsgNum(++msgNum)
  }
  return (
    <React.Fragment>
      <div className="room-info">
        <span>房间号：{roomName}</span>
      </div>
      <div className="room-action">
        {buttonList.map((item, i)=>(
          <div className='action-wrap' onClick={ ()=>showDraw(item,i) } key={i+1}>
            
              {
                item.type === 'chat' ?
                <Badge count={msgNum}>
                  <Button type='default' shape="circle">
                  <GIcon icon={item.icon}></GIcon>
                  </Button>
                </Badge> :
                <Button type='default' shape="circle">
                  <GIcon icon={item.icon}></GIcon>
                </Button>
              }
          </div>
        ))}
        {
          props.roomInfo.userInfo.role === 1?
          <Button type='primary' loading={classStartLoading} onClick={start}>{classStatus ? '下课':'上课'}</Button>:
          null
        }
        
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
          <div style={chooseShow('chat')}>
            <Chatting getMessage={getMessage}  comDidMouted={drawClose} agora={props.roomInfo.agora}></Chatting>;
          </div>
          <div style={chooseShow('file')}>
            <FileList roomInfo={props.roomInfo}></FileList>;
          </div>
          {/* {chooseShow()} */}
        </Drawer>
    </React.Fragment>
  )
}

export default RoomHeader