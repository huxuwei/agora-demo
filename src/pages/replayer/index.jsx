import * as React from 'react'
import {PlayerWhiteboard, player, WhiteWebSdk } from 'white-react-sdk'
import './index.less'
import queryString from 'querystring'
import http from '@/utils/request'
import ToolBox from "@netless/react-tool-box";
import SeekSlider from "@netless/react-seek-slider";
import {Button, Spin} from 'antd'
import {throttle, formatTime } from '@/utils/util'
import "video.js/dist/video-js.css";
import GIcon from '@/components/GIcon'


export default class Replay extends React.Component{
  constructor() {
    super()
    this.state ={
      player: '',
      currentTime: 0,
      progress: 0,
      status: false,
      nowTime: 0,
      timeAll: 0,
      loading: true
    }
  }
  componentDidMount() {
    const { scheduleStr, crmUserStr,roleStr } = queryString.parse(window.location.hash.split('?')[1])
    const params = {
      scheduleStr,
      crmUserStr,
      roleStr
    }
    http.get('getPlayBackInfo',params).then(res=>{
      this.replay(res.data)
    })
    window.addEventListener("resize", () => {
      console.log('room', this.state.player)
      if (this.state.player) {
        this.state.player.refreshViewSize &&this.state.player.refreshViewSize();
        
      }
    });
    
  }
  replay(data) {
    let {hereWhite:{roomToken, uuid, startTime, duration} ,agora:{videoPath} } = data
    // var uuid = 'd8f00d8ba0a74facbbfc42bdf1901334'; // 希望回放房间的 uuid，必须是可回放模式的房间
    // var roomToken = 'WHITEcGFydG5lcl9pZD1OazZwcWdwRUEyRlk0cWNyM01tRGMwZm9MdG96UUpoMXdaQjImc2lnPThiYjI0MWI5N2ZjZmJhNDZiYzE2MDFiM2Q3YjU5NjQwYmExZDAwNzA6YWRtaW5JZD0zNTgmcm9vbUlkPWQ4ZjAwZDhiYTBhNzRmYWNiYmZjNDJiZGYxOTAxMzM0JnRlYW1JZD00ODMmcm9sZT1yb29tJmV4cGlyZV90aW1lPTE1OTk2Njc3MDAmYWs9Tms2cHFncEVBMkZZNHFjcjNNbURjMGZvTHRvelFKaDF3WkIyJmNyZWF0ZV90aW1lPTE1NjgxMTA3NDgmbm9uY2U9MTU2ODExMDc0ODA4ODAw'; // room Token，获取方式原来一致
    // var beginTimestamp = ...; // 回放的开始片段的事件，整数，Unix 时间戳（毫秒）
    // var duration = ...; // 回放片段持续时长（毫秒）
    // var mediaURL = "https://pay.boluozaixian.net:8097/e509104a380c00fa8d2cb13d2fa2c1ec.mp4"; // 由白板接管的媒体文件(可选)，如果需要显示视频，需要提前做一些操作
    var whiteWebSdk = new WhiteWebSdk();
     whiteWebSdk.replayRoom({
      room: uuid,
      roomToken: roomToken,
      duration: duration,
      mediaURL: videoPath,
      // mediaURL: 'https://pay.boluozaixian.net:8097/e509104a380c00fa8d2cb13d2fa2c1ec.mp4',
      beginTimestamp: startTime
    }, {
        onPhaseChanged: phase => {
            console.log(phase);
        },
        onLoadFirstFrame: () => {
        },
        onPlayerStateChanged: modifyState => {
            console.log(modifyState);
        },
        onStoppedWithError: error => {
            console.log(error);
        },
        onScheduleTimeChanged:(currentTime)=>{
          let date = formatTime(currentTime)
          this.setState({
            currentTime,
            nowTime:  `${date.hour}:${date.minute}:${date.second}`
          })  
          
          if(currentTime >= this.state.player.timeDuration) {
            this.refs.playerStartSpin.style.zIndex= 99;
          }
        } 
    }).then((player)=> {
      // 获取到 player 实例
      // 与 room 调用类似，与获取到 player 实例后，你需要将 player 绑定到 HTML 的 div 上。
      // videojs(this.$refs.videoPlayer, playerOptions);
      // player.bindHtmlElement(this.refs.whiteboard);
      // this.player = player
      this.setState({
        player: player,
        status: true,
        loading: false
      })
      player.disableCameraTransform='YES'
      console.log('player', player.timeDuration)
     
    })
  }
  start() {
    this.refs.playerStartSpin.style.zIndex= -99;
    this.state.player.seekToScheduleTime(0);
    this.state.player.play()
    let date = formatTime(this.state.player.timeDuration)
     this.setState({
      timeAll: `${date.hour}:${date.minute}:${date.second}`
     })
  }
  play() {
    const {player, status} = this.state
    if(status){
      player.pause()
    }else{
      player.play()
    }
    this.setState({
      status: !status
    })
    
  }
  render() {
    const {status, timeAll, nowTime, loading } = this.state

    return (
      <div>
        { loading ? <Spin tip="正在加载中..."  size="large" spinning={loading}></Spin>:
        <div>
          <div className='player-start-spin' ref='playerStartSpin'>
            <Button onClick={()=>{this.start()}} shape="round" size='large'>播放</Button>
          </div>
          <div className='player-box-wrap'>
            <PlayerWhiteboard className="player-box" player={this.state.player}/>
            <video className="video-js video-layout"  id="white-sdk-video-js"></video>
          </div>
          <div className='progress'>
            <Button onClick={()=>{this.play()}} type='link'>
              <GIcon width='2em' icon={status ? 'iconzanting-': 'iconbofang1'}></GIcon>
            {/* {status ?'暂停': '播放' } */}
            </Button>
            <SeekSlider
                fullTime={this.state.player.timeDuration || 0}
                thumbColor={"black"}
                bufferColor={"#D8D8D8"}
                sliderColor={"pink"}
                sliderHoverColor={"#E3E3E3"}
                currentTime={this.state.currentTime}
                // bufferProgress={this.state.progress}
                onChange={(time, offsetTime) => {
                    this.setState({
                        currentTime: time,
                    });
                    this.state.player.seekToScheduleTime(time);
                }}
                hideHoverTime={true}
                limitTimeTooltipBySides={true}
            >
            </SeekSlider>
            <span>{`${nowTime}/${timeAll}`}</span>
          </div>
        </div>
        }
      </div>
    )
  }
} 