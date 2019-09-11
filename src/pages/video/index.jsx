import React from 'react'
import './index.less'
import {Message} from 'antd'
import AgoraRTC from 'agora-rtc-sdk'
import {videoConfig} from '@/utils/config.js'
import queryString from 'query-string'
import { connect } from "react-redux";
import {streamInitInfo, errorInfo } from '@/assets/data/errorInfo.js'

 class Video extends React.Component{
  constructor(props){
    super(props)
    this.channel = queryString.parse(window.location.hash.split('?')[1]).room
    this.state = {
      client: {},
      remoteStreamDoMID: ''
    }
    this.first = true
  }
  componentDidMount(nextProps){
    if(this.first){
      this.init(this.props)
      this.first = false
    }
   
  }
  init(nextProps){
    let { mode, codec } = videoConfig;
    let {appId } = nextProps.roomInfo.agora
    // let {client} = this.state
    
    this.client = AgoraRTC.createClient({ mode, codec });
    console.log(appId,this.client)
    this.client.init( appId,() => {
        console.log("AgoraRTC client 初始化成功");
        this.props.Set_client(this.client)
        this.join(nextProps);
      },
      function(err) {
        console.log("AgoraRTC client 初始化失败:", err);
      }
    );
  }
  // 加入
  join(nextProps) {
    const {client} = this
    const {channel, rtcToken, uid} = nextProps.roomInfo.agora
    // 加入直播间
    /**
     * @param token
     * @param channel：频道名称。
     * @param uid 用户的 ID， 整数，需保证唯一性, 如果不指定，即用户 ID 设置为 null，回调会返回一个服务器分配的 uid。
     */
    let _this = this;
    // console.log('this.uidID',uidID)
    client.join(
      rtcToken,
      channel,
      uid,
      uid => {
        console.log("用户 " + uid + " 加入直播间成功:" + channel);
        this.uid = uid;
        this.createSteam();

        //设置 role（用户角色）。role 分为 “host”（主播）和 “audience”（观众）。
        client.setClientRole("host",function() {
            console.log("setHost success:设置Host成功");
          },function(e) {
            console.log("setHost failed: 设置Host失败", e);
          }
        );
        //角色变化的回调
        client.on("client-role-changed", function(evt) {
          console.log("client-role-changed:完成角色变化", evt.role);
        });
        /**
         * 订阅远端音视频
         * 监听 client.on('stream-added') 事件, 当有人发布音视频流到频道里时，会收到该事件。
         * 收到事件后，在回调中调用 client.subscribe 方法订阅远端音视频流。
         */
        // _client.subscribe(stream, function (err) {
        //   console.log("Subscribe stream failed222222222", err);
        // });

        client.on("stream-added", function(evt) {
          var stream = evt.stream;
          console.log(
            "New stream added:创建流1111111111111 " + stream.getId()
          );
          // 设置小流
          // _client.setRemoteVideoStreamType(stream, videoConfig.streamType)
          // _client.setLowStreamParameter({
          //   width: 120,
          //   height: 120,
          //   framerate: 15,
          //   bitrate: 120,
          // })

          client.subscribe(stream, function(err) {
            console.log("Subscribe stream failed", err);
          });
        });

        client.on("stream-subscribed", function(evt) {
          var remoteStream = evt.stream;
          console.log("订阅远程流成功: " + remoteStream.getId());
          console.log("screen", remoteStream.getId());
          // shareScreen
          // let arr = localStorage.getItem('localStreams')
          // if(arr){
          //   arr = JSON.parse(localStorage.getItem('localStreams'))
          // }else{
          //   arr=  []
          // }
            
          let uid = remoteStream.getId();
          let id = "agora_remote" + remoteStream.getId();

          // if (remoteStream.getId() == 666) {
          //   _this.remoteStreamDoMID666 = id;
          //   http
          //     .get("roomUpdateLayout", { name: channel, uid })
          //     .then(res => {
          //       console.log("通知后台播放旁路推流:", uid);
          //     });
          //   _this.$nextTick(() => {
          //     _this.$refs.video666.style.zIndex = 10;
          //     remoteStream.play(_this.remoteStreamDoMID666);
          //     _this.remoteStream = remoteStream;
          //   });

          //   return;
          // } else if (remoteStream.getId() == 777 ) {
          //   console.log(999999,!arr.includes(uid))
          //   if(!arr.includes(uid)){
              
          //     remoteStream.play("screen");
          //     return
          //   }
          //   return
          // }
          _this.setState({
            remoteStreamDoMID: id
          })
          setTimeout(() => {
            remoteStream.play(_this.state.remoteStreamDoMID);
          }, 1000);
        });
      },
      function(err) {
        console.log("加入直播间失败:", err);
        Message.error(`加入直播间失败:${errorInfo[err]}`)
      }
    );
  }

   // 创建音视频流
    // 初始化音视频流
  createSteam() {
    const {client} = this
    let _this = this;
    var localStream = AgoraRTC.createStream({
      streamID: _this.uid,
      audio: true,
      video: true,
      screen: false
    });
    // this.localStream = localStream;

    localStream.setVideoProfile("1080p");
    localStream.init(function() {
        console.log("初始化流成功,播放本地流");
        localStream.play("agora_local");
        _this.props.Set_stream(localStream)

        // 发布本地音视频流
        client.publish(localStream, function(err) {
          console.log(
            "Publish local stream error:发布本地音视频流错误 " + err
          );
        });

        client.on("stream-published", function(evt) {
          console.log(
            "Publish local stream successfully,发布本地音视频流成功"
          );
        });
      },
      function(err) {
        console.log("getUserMedia failed", err);
      }
    );
    //
    client.on("peer-leave", function(evt) {
      var uid = evt.uid;

      let dom = document.getElementById('agora_remote' + uid)
      console.log("离开房间 ", "agora_remote" + uid);
      // if(uid == 666) {
      //   let domPlayer = document.getElementById('player_666')
      //   _this.$refs.video666.style.zIndex = -99
      //   domPlayer&& domPlayer.remove()
      //   return
      // }
      dom&& dom.remove()
    });
  }

  render() {
    // console.log(this.state)
    let {remoteStreamDoMID} = this.state
    
    return (
      <div>
        <div id="agora_local"></div>
        <div id="screen"></div>
        <div className="video" id={remoteStreamDoMID}></div>
        
        {/* <button onClick={this.props.add1}>{this.props.n}</button> */}
      </div>
    )
  }
}
function mapStateToProps(state){
  return {
    n: state.n,
    videoClient: state.client
  }
}
function mapDispatchToProps(dispatch) {
  return {
    add1: ()=> dispatch({type:'add', payload: 1}),
    Set_client: (client)=> dispatch({type:'Set_client', payload: client}),
    Set_stream: (stream)=> dispatch({type:'Set_stream', payload: stream}) 
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Video)