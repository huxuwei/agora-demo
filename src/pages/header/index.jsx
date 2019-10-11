import React, { useState, useEffect } from 'react';
import { Button, Modal, Drawer, Badge, Message } from 'antd'
import http from '@/utils/request'
import GIcon from '@/components/GIcon'
import './index.less'
import FileList from './fileList'
import Chatting from './chat'
import { roleConifg, orderMsgConfig } from '@/utils/config.js'
import { sendMessage } from '@/utils/chatAction.js'
import {connect} from 'react-redux'

const { confirm } = Modal;
class RoomHeader extends React.Component {
  constructor(props) {
    super()
    this.state = {
      classStatus: false,
      classStartLoading: false,
      drawVisible: true,
      active: { type: 'chat' },
      roomName: '',
      msgNum: 0
    }
    this.buttonList = [
      { type: 'file', icon: 'iconziyuan' },
      { type: 'chat', icon: 'iconliaotian' },
    ]
  }
  componentDidMount() {
    const { agora: { channel }, status } = this.props.roomInfo
    this.setState({
      roomName: channel,
      classStatus: status === 1 ? true : false
    })
  }
  start =()=> {
    this.setState({
      classStartLoading: true
    })
    const api = this.state.classStatus ? 'roomStop' : 'roomStart'
    const { id: roomId, userInfo: { id: userId } } = this.props.roomInfo

    if (!this.state.classStatus) {
      http.get(api, { roomId, userId }).then(res => {
        this.setState({
          classStartLoading: false,
          classStatus: !this.state.classStatus
        })
        this.props.startClass(true)
      }).catch(err => {
        this.setState({
          classStartLoading: false
        })
      })
    } else {
      confirm({
        title: '确认消息?',
        content: '确认要下课吗?',
        onOk : ()=> {
          http.get(api, { roomId, userId }).then(res => {
            this.setState({
              classStartLoading: false,
              classStatus: !this.state.classStatus
            })
            this.props.startClass(false)
            // console.log('channelchannelchannelthis.props.channelOrder',this.props.channelOrder)
            //  下课发送离开指令,同时自已也离开
            sendMessage(this.props.channelOrder, orderMsgConfig['video_leave'])
            this.props.client.leave()
          }).catch(err => {
            this.setState({
              classStartLoading: false
            })
          })
        },
        onCancel: ()=> {
          console.log('Cancel');
        },
      });
    }





  }
  showDraw =(item, i)=> {
    this.setState({
      drawVisible: !this.state.drawVisible,
      active: item
    })
    
    if (item.type === 'chat') {
      this.setState({
        msgNum: 0
      })
    }
  }
  drawClose =()=> {
    this.setState({
      drawVisible: false,
      active: {}
    })

  }
  chooseShow=(val)=> {
    if (this.state.active.type === val) {
      return {
        display: 'block',
        height: '100%'
      }
    } else {
      return {
        display: 'none',
        height: '100%'
      }
    }
  }
  getMessage=(val)=> {
    if(this.state.active.type === 'chat'){
      return
    }
    this.setState({
      msgNum:  this.state.msgNum +1
    })
  }
  render() {
    const {showDraw,getMessage,chooseShow,drawClose,start, buttonList ,
      state:{roomName,msgNum,classStartLoading , classStatus ,drawVisible ,active }} = this
    return (
      <React.Fragment>
        <div className="room-info">
          <span>房间号：{roomName}</span>
        </div>
        <div className="room-action">
          {buttonList.map((item, i) => (
            <div className='action-wrap' onClick={() => showDraw(item, i)} key={i + 1}>
    
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
            (this.props.roomInfo.userInfo.role === roleConifg.teach) ?
              <Button type='primary' loading={classStartLoading} onClick={start}>{classStatus ? '下课' : '上课'}</Button> :
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
            <Chatting getMessage={getMessage} comDidMouted={drawClose} agora={this.props.roomInfo.agora}></Chatting>;
              </div>
          <div style={chooseShow('file')}>
            <FileList roomInfo={this.props.roomInfo}></FileList>;
              </div>
          {/* {chooseShow()} */}
        </Drawer>
      </React.Fragment>
    )
  }
  
}
function mapStateToProps(state) {
  return {
    channelOrder: state.channelOrder,
    client: state.client
  }
}
export default connect(mapStateToProps)(RoomHeader)