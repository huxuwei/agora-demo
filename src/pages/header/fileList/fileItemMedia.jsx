import React from 'react'
import {connect} from 'react-redux'
import http from '@/utils/request'
import GIcon from '@/components/GIcon'
import {Message, Spin} from 'antd'

class FileItemMedia extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeIndex: -1,
      list: [],
      playStatus: false,
      delLoading: false
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
  choose=(item, i)=> {
    this.setState({
      activeIndex: i
    })
    console.log(11111,this.props.whiteRoom.insertPlugin,item.url.replace(/http/,'https'))
    
    // return
    this.props.whiteRoom.insertPlugin("video", {
        originX: 0,
        originY: 0,
        width: 480,
        height: 86,
        attributes: {
            pluginAudioUrl: item.url.replace(/http/,'https'),
        },
    });


    // this.props.stream && this.props.stream.stopAudioMixing(() => {
    //   console.log("停止音频播放");
    //   this.props.stream.startAudioMixing({
    //       playTime: 0,
    //       filePath: item.url
    //     },(error)=> {
    //       if (error) {
    //         // 错误处理
    //         console.log("音频播放错误:" + error);
    //         return;
    //       }else{
    //         this.setState({
    //           playStatus: true
    //         })
    //       }
    //     }
    //   )
    // })
    
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
  delFile= (e, item)=>{
    const { id: roomId, userInfo: { id:userId}} = this.props.roomInfo
    const params = {
      roomId,
      userId,
      key: item.key
    }
    this.setState({
      delLoading: true
    })
    http.get("deleteFile", params).then(res => {
      // const {agora, hereWhite} = res.data
      this.props.getFileList()
      Message.success('删除成功')
    }).catch(err=>{
      this.setState({
        delLoading: false
      })
    })
    e.stopPropagation()
  }
  render() {
    let {activeIndex, list, playStatus,delLoading } = this.state
    return (
      <div className="file-list-item-wrap">
        {
          list.map((item, i)=>
          <Spin spinning={false}  tip="Loading..."  key={i}>
           
           <div key={i}
            className= { i === activeIndex ? 'active file-list-item': 'file-list-item'}
            onClick={()=>{this.choose(item,i)}}>
            
            <span>{item.name}</span>
            <span onClick={(e)=>this.delFile(e,item)}><GIcon icon='iconshanchu'></GIcon></span>
            
            {
              // i === activeIndex ?
              // <span onClick={this.play} className='media-control'>
              // {
              //   playStatus ? '暂停': '播放'
              // }
              // <GIcon icon={item.icon}></GIcon></span>:null
            }
            
          </div> 
          </Spin>
          )
        }
        
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    stream: state.stream,
    whiteRoom: state.whiteRoom,
    roomInfo: state.roomInfo
    
  }
}
function maoDispathToProps(dispath) {
  return {
    set_fileInfo :(fileInfo)=>dispath({type:'Set_fileInfo',payload: fileInfo})
  }
}

export default connect(mapStateToProps, maoDispathToProps)(FileItemMedia) 