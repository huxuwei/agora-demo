import React from 'react'
import queryString from 'query-string'
import './index.less'
import { Button } from 'antd';
import {info, createChannel, sendMessage} from './chatInit'
import {  videoConfig } from "@/utils/config.js";
class Chat extends React.Component{
  constructor(props) {
    super(props)
    this.role = queryString.parse(window.location.hash.split('?')[1]).role
    this.state = {
      message: '',
      chatList: [],
      pos: true
    }
  }
  componentDidMount(){
    this.props.comDidMouted()
    const {appId, rtmToken, uid} = this.props.agora
    info({
      appID: appId,
      token: rtmToken,
      uid: uid+''
    },(text)=>{
      console.log('回调成功',text,typeof text)
      this.setMessageContent(text, false)
    })
  }

  send = ()=>{
    const msg = this.refs.chatContent.innerHTML.trim()
    if(!msg)return
    this.setState({
      pos: !this.state.pos
    })
    sendMessage(msg)
    this.refs.chatContent.innerHTML = ''
    this.setMessageContent(msg, true)
  }
  setMessageContent(msg, pos) {
    this.setState({
      chatList: [...this.state.chatList,{msg, pos}]
    })
    this.refs.chatMainInner.scrollTop = this.refs.chatMainInner.scrollHeight
  }
  onKeyDown(e){
    if(e.keyCode === 13) {
      this.send()
      e.preventDefault()
    }
    
  }
  render() {
    let {message,chatList } = this.state
    return (
      <div className='chat-wrap'>
        <header className='chat-header'>聊天</header>
        <main className='chat-main'>
          <div className='chat-main-inner' ref='chatMainInner'>
            {
              chatList.map((item,i)=>(
                <div className={['user-msg-box', item.pos? 'right':'left'].join(' ')} 
                  key={i+1}>
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
          </div>
        </main>
        <footer className='chat-footer'>
          <div ref='chatContent' 
            onKeyDown={(e)=>{this.onKeyDown(e)}}
            className='chat-send-content'
            contentEditable="plaintext-only"
            suppressContentEditableWarning="true"  placeholder='按回车键发送您的消息'>
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