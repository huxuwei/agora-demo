/* eslint-disable no-useless-constructor */
import * as React from 'react'
import { Button } from 'antd'
import axios from 'axios'
import WhiteTool from './whiteTools'
import {whiteConfig} from '@/utils/config.js'
import queryString from 'query-string'
import './index.less'

export default class White extends React.Component{
  constructor() {
    super();
    this.uuid = ''
    this.room = {}
  }
  componentDidMount() {
    this.uuid = queryString.parse(this.props.props.location.search).uuid
    this.init()
    document.body.style.overflow = "hidden";
    window.addEventListener('resize', ()=>{
      if(this.room){
        console.log('resize',this.room.refreshViewSize)
        this.room.refreshViewSize()
      }
    })
   
  }
  init() {
    const that = this
    var sdkToken = whiteConfig.token;
    var url = `https://cloudcapiv4.herewhite.com/room/join?token=${sdkToken}&uuid=${this.uuid}`;
    var requestInit = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            name: '我的第一个 White 房间',
            limit: 4, // 房间人数限制
        }),
    };

    // 请求加入房间
    // 请求创建房间（网络请求部分逻辑，请在服务器实现）
    fetch(url, requestInit).then(function(response) {
        // Step1: 服务器返回进入房间的秘钥 roomToken
        return response.json();
    }).then(function(json) {
        // Step2: 加入房间
        return that.initAndJoinRoom(json);
    }).then(function(room) {
        // Step3: 加入成功后想白板绑定到指定的 dom 中
        console.log(123,that)
      room.bindHtmlElement(that.refs.whiteWrap)
      
      room.refreshViewSize()
      that.room = room
    }).catch(function(err) {
        console.log(err);
    }); 
  }

  initAndJoinRoom (json) {
    // 初始化 SDK，并且调用其成员方法 joinRoom
    var whiteWebSdk = new WhiteWebSdk();
    return whiteWebSdk.joinRoom({
        uuid: this.uuid,
        roomToken: json.msg.roomToken,
    });
  }

  ended() {
    axios({
      url: `https://cloudcapiv4.herewhite.com/banRoom?token=${whiteConfig.token}`,
      method: 'POST',
      data: {
        ban: true,
        uuid: this.uuid
      }
    })
  }

  changeTool(val) {
    this.room.setMemberState({
      currentApplianceName: val,
    })
  }

  render() {
    return (
      <div className="white-wrap">
        <div className="wrap" ref="whiteWrap"></div>
        <WhiteTool className="white-tools" changeTool={this.changeTool.bind(this)} ></WhiteTool>
        <Button onClick={this.ended.bind(this)}>下课</Button>
      </div>
    )
  }
}