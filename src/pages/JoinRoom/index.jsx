/* eslint-disable no-useless-constructor */
import * as React from 'react'
import './index.less'
import { Input, Button } from 'antd'
import http from '@/utils/request'
import { HashRouter} from 'react-router-dom'
import PropTypes from 'prop-types'

class JoinHome extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      room: '',
      roomInfo: {}
    }
  }
  roomChange = e=>{
    // console.log(this.props)
    this.setState({
      room:e.target.value
    })
  }

  joinRoom = () =>{
    let {room} = this.state
    http.get('roomName',{name: room }).then(res=>{
      console.log('res',res.data)
      let {herewhite, agora  } = res.data
      this.setState({
        roomInfo: {
          uuid: herewhite.uuid,
          roomName: agora.name
        }
      })
      this.props.history.push({
        pathname: '/room',
        search: `uuid=${herewhite.uuid}&roomName=${agora.name}`
      })
    })
  }

  render() {
    return (
      <div className="page-box">
        <div className="page-box-left">
          <div className="page-box-left-mid">
            <div>
              <Input  className="room-input" 
                value={this.state.room}
                onChange={this.roomChange}
                placeholder="房间号"  ></Input>
              <Button className="room-join" onClick={this.joinRoom}>加入房间</Button>
              <Button className="room-join">查看回放</Button>
              {/* <el-input className="room-input" 
                placeholder="房间号" v-model="room"></el-input>
              <el-button className="room-join" >加入房间</el-button>
              <el-button className="room-join">回放</el-button> */}
            </div>
          </div>
        </div>
        <div className="page-box-right"></div>
      </div>
    )
  }
}

export default JoinHome