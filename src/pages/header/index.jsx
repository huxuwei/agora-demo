import React, { useState, useEffect } from 'react';
import { Button, Modal, Drawer, Badge, Message } from 'antd'
import http from '@/utils/request'
import GIcon from '@/components/GIcon'
import './index.less'
import FileList from './fileList'
import Chatting from './chat'
import TalkingStatus from './talkingStatus'
import Setting from './setting'
import { roleConifg, orderMsgConfig, roomConfig } from '@/utils/config.js'
import { sendMessage } from '@/utils/chatAction.js'
import { connect } from 'react-redux'
import {formatTime} from '@/utils/util.js'

const { confirm } = Modal;
class RoomHeader extends React.Component {
  constructor(props) {
    super()
    this.state = {
      classStatus: false,
      classStartLoading: false,
      drawVisible: true,
      talkingStatusVisible: false,
      SettingVisible: false, 
      active: { type: 'chat' },
      roomName: '',
      msgNum: 0,
      classStartTime: '00:00:00'
    }
  }
  componentDidMount() {
    const { agora: { channel }, status, startTimeAfter } = this.props.roomInfo

    let time = formatTime(startTimeAfter) 
   
    this.setState({
      roomName: channel,
      classStatus: status === 1 ? true : false,
      classStartTime: `${time.hour}:${time.minute}:${time.second}`
    }, () => {
      // this.timeOut()
    })
    this.classStartTime()
  }

  // 开始上课时间
  classStartTime() {
    const {  startTimeAfter } = this.props.roomInfo

    let startTime = startTimeAfter

    const timer = setInterval(() => {
      if(!this.state.classStatus){
        clearInterval(timer)
      }
      startTime += 1000
      let time = formatTime(startTime)
      this.setState({
        classStartTime: `${time.hour}:${time.minute}:${time.second}`
      })
    }, 1000);
  }


  start = () => {
    this.setState({
      classStartLoading: true
    })
    const api = this.state.classStatus ? 'roomStop' : 'roomStart'
    const { id: roomId, userInfo: { id: userId } } = this.props.roomInfo

    if (!this.state.classStatus) {
      // 开始上课
      http.get(api, { roomId, userId }).then(res => {
        this.setState({
          classStartLoading: false,
          classStatus: !this.state.classStatus
        }, () => {
          this.timeOut()
        })
        this.classStartTime()
        this.props.startClass(true)
        // 课程结束前提前请求延长课程时间
        
      }).catch(err => {
        this.setState({
          classStartLoading: false
        })
      })
    } else {
      confirm({
        title: '确认消息?',
        content: '确认要下课吗?',
        onOk: () => {
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
            window.close()
          }).catch(err => {
            this.setState({
              classStartLoading: false
            })
          })
        },
        onCancel: () => {
          this.setState({
            classStartLoading: false
          })
          // console.log('Cancel');
        },
      });
    }
  }
  // 课程时间长度延迟
  timeOut() {
    const { timeRemaining } = this.props.roomInfo
    const time = timeRemaining - roomConfig.timeSec
    console.log('timout调用了')
    this.delay(time)
    // return this.delay
  }
  delay(time) {
    const { id: roomId, userInfo: { id: userId, role } } = this.props.roomInfo

    if (!this.state.classStatus && role !== roomConfig.teach) return
    console.log('开始倒计时', time)
    const s = setTimeout(() => {
      const params = {
        roomId,
        userId,
        minute: roomConfig.delayTime
      }
      console.log('发送延长请求')
      http.get('delay', params).then(res => {
        const time = res.data - roomConfig.timeSec
        this.delay(roomConfig.delayTime * 1000 * 60)
        console.log(`res.data的值为${res.data},time的值为${roomConfig.delayTime * 1000 * 60}`)
        console.log(`课程延长了${roomConfig.delayTime}分钟`)
      })
      clearTimeout(s)
    }, time);
  }
  showDraw = (item, i) => {
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
  talkingStatusShow = () => {
    this.setState({
      talkingStatusVisible: true
    })
  }
  drawClose = () => {
    this.setState({
      drawVisible: false,
      active: {}
    })

  }
  chooseShow = (val) => {
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
  getMessage = (val) => {
    if (this.state.active.type === 'chat') {
      return
    }
    this.setState({
      msgNum: this.state.msgNum + 1
    })
  }
  render() {
    const { showDraw, getMessage, chooseShow, drawClose, start, talkingStatusShow,
      state: { roomName, msgNum, classStartLoading, classStatus, drawVisible,
        active, talkingStatusVisible, SettingVisible, classStartTime
      },
    } = this
    // 是否是老师
    const isTeach = this.props.roomInfo.userInfo.role === roleConifg.teach
    const isStu = this.props.roomInfo.userInfo.role === roleConifg.stu
    const iconStyle ={width:'24px', height: '24px', color:'#262626'}
    return (
      <React.Fragment>
        <div className="room-info">
          <div><span>房间号：</span><b>{roomName.slice(0,10)}</b></div>
          <span>{classStartTime}</span>
        </div>
        <div className="room-action">
          {/* 课件 */}
          {
            isStu ? null:
            <div className='action-wrap' onClick={() => showDraw({ type: 'file' })}>
              <Button type='link' shape="circle">
                <GIcon icon='iconkejianku' color={iconStyle.color}  width={iconStyle.width} height={iconStyle.height}></GIcon>
              </Button>
            </div>
          }
          {/* 聊天 */}
          <div className='action-wrap' onClick={() => showDraw({ type: 'chat' })}>
            <Badge count={msgNum}>
              <Button type='link' shape="circle">
                <GIcon icon='iconliuyan' color={iconStyle.color}  width={iconStyle.width} height={iconStyle.height}></GIcon>
              </Button>
            </Badge>
          </div>
          {/* 网络信息 */}
          <div className='action-wrap' onClick={() =>this.setState({talkingStatusVisible: true})}>
            <Button type='link' shape="circle">
              <GIcon icon='icondiannao' color={iconStyle.color} width={iconStyle.width} height={iconStyle.height}></GIcon>
            </Button>
          </div>
          {/* 设置 */ }
          <div className='action-wrap' onClick={() => this.setState({SettingVisible:true})}>
            <Button type='link' shape="circle">
              <GIcon color={iconStyle.color} width={iconStyle.width} height={iconStyle.height} icon='iconsetting'></GIcon>
            </Button>
          </div>
          {/* 上课/下课 */}
          {
            isTeach &&
            <Button className='class-start-end' type='primary' loading={classStartLoading} onClick={start}>{classStatus ? '下课' : '上课'}</Button>
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
            <Chatting getMessage={getMessage} visible={drawVisible} comDidMouted={drawClose} agora={this.props.roomInfo.agora}></Chatting>;
          </div>
          <div style={chooseShow('file')}>
            <FileList roomInfo={this.props.roomInfo}></FileList>;
          </div>
        </Drawer>
        <Modal
          footer={null}
          onCancel={() => this.setState({ talkingStatusVisible: false })}
          visible={talkingStatusVisible}
        >
          <TalkingStatus></TalkingStatus>
        </Modal>

        <Modal
          width='500px'
          footer={null}
          onCancel={() => this.setState({ SettingVisible: false })}
          visible={SettingVisible}
        >
          <Setting></Setting>
        </Modal>
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