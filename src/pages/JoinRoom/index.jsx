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
      search: `scheduleStr=3faf065f28b249ef&&crmUserStr=10da4dcba07b32ca&&roleStr=425413fcd9ab7f73`
    })
  }
  replay = () =>{
    this.props.history.push({
      pathname: '/room',
      search: `scheduleStr=3faf065f28b249ef&&crmUserStr=0ee4782a261c3659&&roleStr=425413fcd9ab7f73`
    })
  }
  teach= ()=>{
    this.props.history.push({
      pathname: '/room',
      search: `scheduleStr=3faf065f28b249ef&&crmUserStr=99068348943be0b4&&roleStr=f39e88cf9f175538`
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
              <Button className="room-join" onClick={this.joinRoom}>学生1</Button>
              <Button className="room-join"  onClick={this.replay}>学生2</Button>
              <Button className="room-join"  onClick={this.teach}>老师</Button>
            </div>
          </div>
        </div>
        <div className="page-box-right"></div>
      </div>
    )
  }
}

export default JoinHome