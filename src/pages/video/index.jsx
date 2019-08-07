import * as React from 'react'
import './index.less'
import AgoraRTC from 'agora-rtc-sdk'
import {videoConfig} from '@/utils/config.js'
import http from '@/utils/request'
import queryString from 'query-string'

export default class Video extends React.Component{
  constructor(props) {
    super(props)
    this.client = {}
    this.localStream = {}
  }
  componentDidMount() {
    this.init()
  }

  init() {
    let {appID, mode, codec} = videoConfig
    this.client = AgoraRTC.createClient({mode, codec});

    this.client.init( appID,  ()=> {
      console.log("AgoraRTC client 初始化成功");
      this.join()
    }, function (err) {
      console.log("AgoraRTC client 初始化失败:", err);
    });
  }

  // 加入
  join() {
    // 加入直播间
    /**
     * @param token
     * @param channel：频道名称。
     * @param uid 用户的 ID， 整数，需保证唯一性, 如果不指定，即用户 ID 设置为 null，回调会返回一个服务器分配的 uid。
     */
    let _this = this
    const channel  = queryString.parse(this.props.props.location.search).roomName

    this.client.join(videoConfig.token, channel, null, (uid)=> {
      console.log("用户 " + uid + " 加入直播间成功:" + channel);
      this.uid = uid
      this.createSteam()
      console.log('client:',this.client)


       /**
         * 订阅远端音视频
         * 监听 client.on('stream-added') 事件, 当有人发布音视频流到频道里时，会收到该事件。
         * 收到事件后，在回调中调用 client.subscribe 方法订阅远端音视频流。
         */
          // _this.client.subscribe(stream, function (err) {
          //   console.log("Subscribe stream failed222222222", err);
          // });


        _this.client.on('stream-added', function (evt) {
          var stream = evt.stream;
          console.log("New stream added:创建流1111111111111 " + stream.getId());
          // 设置小流
          // _this.client.setRemoteVideoStreamType(stream, videoConfig.streamType)
          // _this.client.setLowStreamParameter({
          //   width: 120,
          //   height: 120,
          //   framerate: 15,
          //   bitrate: 120,
          // })

          _this.client.subscribe(stream, function (err) {
            console.log("Subscribe stream failed", err);
          });
        });

        _this.client.on('stream-subscribed', function (evt) {
          var remoteStream = evt.stream;
          console.log("订阅远程流成功: " + remoteStream.getId());
          _this.remoteStreamDoMID = 'agora_remote' + remoteStream.getId()
          remoteStream.play(_this.remoteStreamDoMID);
        })
    }, function(err) {
      console.log("加入直播间失败:", err);
    });
  }

  // 创建音视频流
  // 初始化音视频流
  createSteam() {
    let _this = this
    var localStream = AgoraRTC.createStream({
        streamID: _this.uid,
        audio: true,
        video: true,
        screen: false}
    );
    this.localStream = localStream
    localStream.setVideoProfile("1080p");
    localStream.init(function() {
        console.log("初始化流成功,播放本地流");
        localStream.play('agora_local');

        // 发布本地音视频流
        _this.client.publish(localStream, function (err) {
          console.log("Publish local stream error:发布本地音视频流错误 " + err);
        });

        _this.client.on('stream-published', function (evt) {
          console.log("Publish local stream successfully,发布本地音视频流成功");
        });

      }, function (err) {
        console.log("getUserMedia failed", err);
      });
      // 
      _this.client.on("peer-leave", function(evt) {
        // var stream = evt.stream;
          var uid = evt.uid;
        console.log("离开房间 ", uid);
        let dom = document.getElementById('agora_remote' + uid)
        dom&& dom.remove()
        //……
    });

  }

  leaveRoom() {
    this.client.leave(function () {
      console.log("Leave channel successfully");
    }, function (err) {
      console.log("Leave channel failed");
    });
  }

  getVideoInfo() {
    console.log('getVideoTrack', this.localStream.getVideoTrack())
    console.log('getStats', this.localStream.getStats())
    //  console.log('setVideoProfile', this.localStream.setVideoProfile())
    console.log('getSystemStats',  this.client,this.client.getSystemStats())
    
  }

  render() {
    return (
      <div>
        <div>
          <el-button onClick={this.getVideoInfo}>视频信息</el-button>
        </div>
        <div id="agora_local"></div>
        <div className="video" id={this.remoteStreamDoMID}></div>
      </div>
    )
  }
}