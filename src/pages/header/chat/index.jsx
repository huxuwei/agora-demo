import React from 'react'
import './index.less'
import { Button } from 'antd';

class Chat extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }
  }
  send = ()=>{

  }
  render() {
    let {message } = this.state
    return (
      <div className='chat-wrap'>
        <header className='chat-header'>聊天</header>
        <main className='chat-main'></main>
        <footer className='chat-footer'>
          <div suppressContentEditableWarning="true"  contentEditable={true} placeholder='按回车键发送您的消息'>
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