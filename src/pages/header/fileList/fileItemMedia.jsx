import React from 'react'
import {connect} from 'react-redux'
import http from '@/utils/request'
import GIcon from '@/components/GIcon'

class FileItemMedia extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeIndex: -1,
      list: [],
      playStatus: false
    }
  }
  componentDidMount() {
    this.setState({
      list: [ ...this.props.fileList],
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: [ ...nextProps.fileList],
    })
  }
  choose(item, i) {
    this.setState({
      activeIndex: i
    })
    this.props.stream && this.props.stream.stopAudioMixing(() => {
      console.log("停止音频播放");
      this.props.stream.startAudioMixing({
          playTime: 0,
          filePath: item.url
        },(error)=> {
          if (error) {
            // 错误处理
            console.log("音频播放错误:" + error);
            return;
          }else{
            this.setState({
              playStatus: true
            })
          }
        }
      )
    })
    
  }
  play=(e)=> {
    const {playStatus} = this.state
    if(playStatus){
      this.props.stream &&this.props.stream.pauseAudioMixing((err)=>{
        if(err){
          console.log("音频暂停错误:",err)
        }else{
          this.setState({
            playStatus: false
          })
        }
      })
    }else{
      this.props.stream &&this.props.stream.resumeAudioMixing((err)=>{
        if(err){
          console.log("音频恢复失败:",err)
        }else{
          this.setState({
            playStatus : true
          })
        }
      })
    }
    e.stopPropagation()
  }

  render() {
    let {activeIndex, list, playStatus } = this.state
    return (
      <div className="file-list-item-wrap">
        {
          list.map((item, i)=>
          <div key={i}
            className= { i === activeIndex ? 'active file-list-item': 'file-list-item'}
            onClick={()=>{this.choose(item,i)}}>
            <span>{item.name}</span>
            {
              i === activeIndex ?
              <span onClick={this.play} className='media-control'>
              {
                playStatus ? '暂停': '播放'
              }
              <GIcon icon={item.icon}></GIcon></span>:null
            }
            
          </div>
          )
        }
        
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    stream: state.stream
  }
}
function maoDispathToProps(dispath) {
  return {
    set_fileInfo :(fileInfo)=>dispath({type:'Set_fileInfo',payload: fileInfo})
  }
}

export default connect(mapStateToProps, maoDispathToProps)(FileItemMedia) 