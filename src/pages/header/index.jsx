import React, { useState, useEffect } from 'react';
import { Button, Modal, Drawer, Badge, Message } from 'antd'
import http from '@/utils/request'
import GIcon from '@/components/GIcon'
import './index.less'
import FileList from './fileList'
import Chatting from './chat'
import TalkingStatus from './talkingStatus'
import { roleConifg, orderMsgConfig, roomConfig } from '@/utils/config.js'
import { sendMessage } from '@/utils/chatAction.js'
import { connect } from 'react-redux'


const { confirm } = Modal;
class RoomHeader extends React.Component {
  constructor(props) {
    super()
    this.state = {
      classStatus: false,
      classStartLoading: false,
      drawVisible: true,
      talkingStatusVisible: false,
      active: { type: 'chat' },
      roomName: '',
      msgNum: 0
    }
  }
  componentDidMount() {
    const { agora: { channel }, status } = this.props.roomInfo
    this.setState({
      roomName: channel,
      classStatus: status === 1 ? true : false
    }, () => {
      // this.timeOut()
    })

  }
  start = () => {
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
        }, () => {
          this.timeOut()
        })
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
        active, talkingStatusVisible
      },
    } = this
    // 是否是老师
    const isTeach = this.props.roomInfo.userInfo.role === roleConifg.teach
    const isStu = this.props.roomInfo.userInfo.role === roleConifg.stu
    return (
      <React.Fragment>
        <div className="room-info">
          <div>房间号：{roomName.slice(0, 10)}...</div>
          {/* <span>{roomName}</span> */}
        </div>
        <div className="room-action">
          {/* 课件 */}
          {
            isStu ? null:
            <div className='action-wrap' onClick={() => showDraw({ type: 'file' })}>
              <Button type='default' shape="circle">
                <GIcon icon='iconziyuan'></GIcon>
              </Button>
            </div>
          }
          {/* 聊天 */}
          <div className='action-wrap' onClick={() => showDraw({ type: 'chat' })}>
            <Badge count={msgNum}>
              <Button type='default' shape="circle">
                <GIcon icon='iconliaotian'></GIcon>
              </Button>
            </Badge>
          </div>
          {/* 网络信息 */}
          <div className='action-wrap' onClick={() => talkingStatusShow()}>
            <Button type='default' shape="circle">
              <GIcon icon='iconnetwork-management'></GIcon>
            </Button>
          </div>
          {/* 上课/下课 */}
          {
            isTeach ?
            <Button type='primary' loading={classStartLoading} onClick={start}>{classStatus ? '下课' : '上课'}</Button>
            :
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