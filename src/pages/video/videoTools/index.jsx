import React from 'react'
import GIcon from '@/components/GIcon'
import {connect} from 'react-redux'
import { createChannel, sendMessage} from '@/utils/chatAction.js'
class VideoTools extends React.Component{
  constructor(props){
    super(props)
    this.state= {}
  }
  closeAudio(){
    const {stream, uid} = this.props.remote
    stream.disableAudio()
    sendMessage(this.props.channel, `video_closeAudio_${uid}`)
  }
  closeVideo(){
    const {stream, uid} = this.props.remote
    
    stream.disableVideo()
    sendMessage(this.props.channel, `video_closeVideo_${uid}`)
  }
  resume(){
    const {stream, uid} = this.props.remote
    stream.enableAudio()
    stream.enableVideo()
    sendMessage(this.props.channel, `video_resume_${uid}`)
  }
  render() {
    return (
      <div className='video-tools-wrap'>
        <span onClick={()=>{this.closeAudio()}}>音频</span>
        <span onClick={()=>{this.closeVideo()}}>视频</span>
        <span onClick={()=>{this.resume()}}>恢复</span>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    msgClient: state.msgClient
  }
}

export default connect(mapStateToProps)(VideoTools)