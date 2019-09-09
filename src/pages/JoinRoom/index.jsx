/* eslint-disable no-useless-constructor */
import * as React from 'react'
import './index.less'
import { Input, Button, Radio  } from 'antd'

class JoinHome extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      room: '',
      role: 1
    }
  }
  roomChange = (item, value)=>{
    this.setState({
      [item]:value.target.value
    })
  }

  joinRoom = () =>{
    let {room, role} = this.state
   
    this.props.history.push({
      pathname: '/room',
      search: `room=${room}&role=${role}`
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
                onChange={(v)=>this.roomChange('room',v)}
                placeholder="房间号"  ></Input>
              <Radio.Group value={this.state.role} onChange={(v)=>this.roomChange('role',v)}>
                <Radio value={1}>老师</Radio>
                <Radio value={2}>学生</Radio>
              </Radio.Group>
              <Button className="room-join" onClick={this.joinRoom}>加入房间</Button>
              <Button className="room-join">查看回放</Button>
            </div>
          </div>
        </div>
        <div className="page-box-right"></div>
      </div>
    )
  }
}

export default JoinHome