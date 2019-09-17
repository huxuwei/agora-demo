import React from 'react'
import GIcon from '@/components/GIcon'

class VideoTools extends React.Component{
  constructor(props){
    super(props)
    this.state= {}
  }
  componentDidUpdate(val){
    console.log('remoteStreamList',val)
  }
  audioChange(){
    console.log('remoteStream',this.props)
    this.props.remoteStream.disableVideo()
  }
  render() {
    return (
      <div className='video-tools-wrap'>
        <span onClick={()=>{this.audioChange()}}>音频</span>
        <span onClick={()=>{this.audioChange()}}>视频</span>
        <span onClick={()=>{this.audioChange()}}>恢复</span>
      </div>
    )
  }
}

export default VideoTools