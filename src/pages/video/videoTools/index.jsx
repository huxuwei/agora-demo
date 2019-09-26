import React from 'react'
import GIcon from '@/components/GIcon'
import {connect} from 'react-redux'
import {  sendMessage} from '@/utils/chatAction.js'

class VideoTools extends React.Component{
  constructor(props){
    super(props)
    this.state= {
      audioStatus: true,
      videoStatus: true
    }
  }
  closeAudio=()=>{
    const {stream, uid} = this.props.remote
    stream.disableAudio()
    sendMessage(this.props.channelOrder, `video_closeAudio_${uid}`)
    this.setState({
      audioStatus: false
    })
  }
  closeVideo=()=>{
    const {stream, uid} = this.props.remote
    stream.disableVideo()
    sendMessage(this.props.channelOrder, `video_closeVideo_${uid}`)
    this.setState({
      videoStatus: false
    })
  }
  resume=()=>{
    const {stream, uid} = this.props.remote
    stream.enableAudio()
    stream.enableVideo()
    sendMessage(this.props.channelOrder, `video_resume_${uid}`)
    this.setState({
      videoStatus: true,
      audioStatus: true
    })
  }
  render() {
    const {audioStatus,videoStatus} = this.state
    return (
      <div className='video-tools-wrap'>
        <span onClick={()=>{this.closeAudio()}}>
          <GIcon icon={audioStatus?'iconmaikefeng1':'iconcanhuiren-jinyongmaikefeng'} width='2em'></GIcon>
        </span>
        <span onClick={()=>{this.closeVideo()}}>
          <GIcon icon={videoStatus?'iconshipin':'iconjinyongshipin'} width='2em'></GIcon>
        </span>
        <span onClick={()=>{this.resume()}}>
        <GIcon icon={'iconhuifu'} width='2em'></GIcon>
        
        </span>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    msgClient: state.msgClient,
    channelOrder: state.channelOrder
  }
}

export default connect(mapStateToProps)(VideoTools)