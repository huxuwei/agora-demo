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
    this.myRef=React.createRef();
  }
  roomChange = (item, value)=>{
    this.setState({
      [item]:value.target.value
    })
  }

  joinRoom = () =>{
    // console.log(1111,this.myRef.current);
    // // this.form.createaa()
    // this.myRef.props.createaa()
    let {room, role} = this.state
   
    this.props.history.push({
      pathname: '/room',
      search: `scheduleStr=3223b7a94ae4659c&crmUserStr=2d93241eb821e499&roleStr=425413fcd9ab7f73`
    })
  }
  replay = () =>{
    this.props.history.push({
      pathname: '/room',
      search: `scheduleStr=3223b7a94ae4659c&crmUserStr=4e9390f2415a2887&roleStr=425413fcd9ab7f73`
    })
  }
  teach= ()=>{
    this.props.history.push({
      pathname: '/room',
      search: `scheduleStr=3223b7a94ae4659c&crmUserStr=c6982b71367f0af1&roleStr=f39e88cf9f175538`
    })
  }
  add= ()=>{
    this.props.history.push({
      pathname: '/room',
      search: `scheduleStr=3223b7a94ae4659c&crmUserStr=1efe624482aba94f&roleStr=f39e88cf9f175538`
    })
  }
  tech4= ()=>{
    this.props.history.push({
      pathname: '/room',
      search: `scheduleStr=3223b7a94ae4659c&crmUserStr=425413fcd9ab7f73&roleStr=a334fbadc0474f0c`
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
              <Button className="room-join"  onClick={this.joinRoom}>学生1</Button>
              <Button className="room-join"  onClick={this.replay}>学生2</Button>
              <Button className="room-join"  onClick={this.teach}>老师</Button>
              <Button className="room-join"  onClick={this.add}>巡课</Button>
              <Button className="room-join"  onClick={this.tech4}>助教</Button>
            </div>
          </div>
        </div>
        <div className="page-box-right"></div>
      </div>
    )
  }
}

export default JoinHome