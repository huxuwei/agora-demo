import React from 'react'
import './index.less'
import { ViewMode } from "white-web-sdk";
import {roleConifg} from '@/utils/config.js'
import queryString from 'query-string'
import { connect } from "react-redux";
import WhiteTools from './whiteTools'
import WhiteAction from './whiteAction'
import {WhiteWebSdk} from 'white-react-sdk'
import "white-web-sdk/style/index.css";
class White extends React.Component{
  constructor(props){
    super(props)
    this.channel = queryString.parse(window.location.hash.split('?')[1]).room
    this.state = {
      loaded: false
    }
    this.first = true
  }

  componentDidMount() {
    this.initAndJoinRoom(this.props)
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", () => {
      if (this.room) {
        this.room.refreshViewSize &&this.room.refreshViewSize();
      }
    });
  }
  

  async initAndJoinRoom(nextProps) {
    
    const {hereWhite:{roomToken, uuid}, userInfo:{role}} = nextProps.roomInfo
    // 初始化 SDK，并且调用其成员方法 joinRoom
    const whiteWebSdk = new WhiteWebSdk();
    this.room = await  whiteWebSdk.joinRoom({
      uuid,
      roomToken
    });
    let {room} = this
    room.bindHtmlElement(this.refs.whiteWrap);

    // 白板自适应
    room.refreshViewSize();
     // 设置成主播
     role === 1 && room.setViewMode("broadcaster");
     // 禁止缩放
     room.disableCameraTransform='YES'
     // 设置初始颜色
     room.setMemberState({
       strokeColor: [255, 0, 0],
     });
     this.changeTool('selector')
     this.readOnly(room)
     
     this.props.Set_whiteRoom(room)
     this.setState({
      loaded: true
     })

    //  let pptConverter = whiteWebSdk.pptConverter(roomToken);
    //   pptConverter.convert({
    //     url: 'http://pw83lvz3f.bkt.clouddn.com/ppt.ppt',
    //     kind: "static",
    //   }).then(function(result) {
    //     // scenes 就是用来创建 pptx 对应的场景的描述信息
    //     var scenes = result.scenes;
    //     console.log('scenesscenesscenesscenesscenesscenesscenesscenes',scenes)
    //   });
  }
  readOnly(room) {
    //只读，再设置为跟随
    if (this.props.roomInfo.userInfo.role !== 1) {
      room.disableOperations = true;
      room.setViewMode(ViewMode.Follower);
    }
  }
  changeTool = (val)=>{
    this.room.setMemberState({
      currentApplianceName: val
    });
  }
  addRoomEvent() {
    // this.room.addMagixEventListener('claaStart',this.message('开始上课啦')) ;
    // this.room.addMagixEventListener('claaStop', this.classStop);
    // this.room.addMagixEventListener('stop', this.stop);
    // this.room.addMagixEventListener('play', this.play);
  }
  render() {
    const {changeTool} = this
    return (
      <div className="white-wrap">
        <div className="wrap" ref="whiteWrap" id="whiteWrap"></div>
        {
          (this.props.roomInfo && this.props.roomInfo.userInfo && 
            this.props.classStatus && 
            (this.props.roomInfo.userInfo.role === roleConifg.teach ) )  ? 
          <React.Fragment>
            <WhiteTools changeTool={changeTool}></WhiteTools>
            {this.state.loaded && <WhiteAction></WhiteAction>}
          </React.Fragment>: null
        }
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    n: state.n,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    add1: ()=> dispatch({type:'add', payload: 1}),
    Set_whiteRoom: (whiteRoom)=> dispatch({type: 'Set_whiteRoom', payload: whiteRoom})
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(White)