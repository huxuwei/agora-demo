import React from 'react'
import './index.less'
import { Button } from 'antd';
import {info, createChannel, sendMessage} from './chatInit'
import {  videoConfig } from "@/utils/config.js";
class Chat extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      chatList: [],
      pos: true
    }
  }
  componentDidMount() {
    let { appID, mode, codec } = videoConfig;
    let infoClient = info({
      appID,
      token: undefined,
      uid: Math.round(Math.random()*1000000)+'1'
    },(text)=>{
      console.log('回调成功',text,typeof text)
    })
  }
  send = ()=>{
    this.setState({
      pos: !this.state.pos
    })
    const msg = this.refs.chatContent.innerHTML
    sendMessage(msg)
    this.refs.chatContent.innerHTML = ''
    
    this.setState({
      chatList: [...this.state.chatList,{msg, role:this.state.pos }]
    })
  }
  render() {
    let {message,chatList } = this.state
    return (
      <div className='chat-wrap'>
        <header className='chat-header'>聊天</header>
        <main className='chat-main'>
          {
            chatList.map(item=>(
              <div className={['user-msg-box', item.role ? 'right':'left'].join(' ')} key={item.msg}>
                <div className='user-title'>
                  <span>10:20</span>
                  <span>角色名</span>
                </div>
                <div className='user-message'>
                  <span>{item.msg}</span>
                </div>
              </div>
            ))
          }
        </main>
        <footer className='chat-footer'>
          <div ref='chatContent' suppressContentEditableWarning="true"  contentEditable={true} placeholder='按回车键发送您的消息'>
            {message}
          </div>
          <Button className='chat-send' onClick={this.send} size='small' type='primary'>
            发送
          </Button>
        </footer>
      </div>
    )
  }
}

export default Chat