import * as React from 'react'
import {PlayerWhiteboard, player, WhiteWebSdk } from 'white-react-sdk'
import './index.less'
export default class Replay extends React.Component{
  constructor() {
    super()
    this.state ={
      player: ''
    }
  }
  componentDidMount() {
    this.replay()
  }
  replay() {
    // let {roomToken, uuid,videoPath, startTime  } = data
    var uuid = 'd8f00d8ba0a74facbbfc42bdf1901334'; // 希望回放房间的 uuid，必须是可回放模式的房间
    var roomToken = 'WHITEcGFydG5lcl9pZD1OazZwcWdwRUEyRlk0cWNyM01tRGMwZm9MdG96UUpoMXdaQjImc2lnPThiYjI0MWI5N2ZjZmJhNDZiYzE2MDFiM2Q3YjU5NjQwYmExZDAwNzA6YWRtaW5JZD0zNTgmcm9vbUlkPWQ4ZjAwZDhiYTBhNzRmYWNiYmZjNDJiZGYxOTAxMzM0JnRlYW1JZD00ODMmcm9sZT1yb29tJmV4cGlyZV90aW1lPTE1OTk2Njc3MDAmYWs9Tms2cHFncEVBMkZZNHFjcjNNbURjMGZvTHRvelFKaDF3WkIyJmNyZWF0ZV90aW1lPTE1NjgxMTA3NDgmbm9uY2U9MTU2ODExMDc0ODA4ODAw'; // room Token，获取方式原来一致
    // var beginTimestamp = ...; // 回放的开始片段的事件，整数，Unix 时间戳（毫秒）
    // var duration = ...; // 回放片段持续时长（毫秒）
    // var mediaURL = "https://example.com/media.m3u8"; // 由白板接管的媒体文件(可选)，如果需要显示视频，需要提前做一些操作
    var whiteWebSdk = new WhiteWebSdk();
    whiteWebSdk.replayRoom({
      room: uuid,
      roomToken: roomToken,
      // mediaURL: videoPath,
      // beginTimestamp: startTime
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
        // onScheduleTimeChanged:  throttle((scheduleTime)=>{
        //       let per = scheduleTime/ this.player.timeDuration
        //       this.percentage = per *100
        //       this.scheduleTime =scheduleTime
        //   },100)
    }).then((player)=> {
      // 获取到 player 实例
      // 与 room 调用类似，与获取到 player 实例后，你需要将 player 绑定到 HTML 的 div 上。
      // videojs(this.$refs.videoPlayer, playerOptions);
      // player.bindHtmlElement(this.refs.whiteboard);
      // this.player = player
      this.setState({
        player: player
      })
      console.log('player', player.timeDuration)
      player.play()
      this.status = true
    })
  }

  render() {
    return (
      <div>
        {this.state.player && <PlayerWhiteboard className="player-box" player={this.state.player}/>}
      </div>
    )
  }
} 