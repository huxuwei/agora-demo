/* eslint-disable no-useless-constructor */
import * as React from 'react'
import './index.less'
import { Input, Button, Radio  } from 'antd'
import AFrom from '../from/index'
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
  add= ()=>{
    this.props.history.push({
      pathname: '/room',
      search: `scheduleStr=3faf065f28b249ef&crmUserStr=1efe624482aba94f&roleStr=f39e88cf9f175538`
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
              <Button className="room-join"  onClick={this.add}>巡课</Button>
            </div>
          </div>
        </div>
        <div className="page-box-right"></div>
        {/* <AFrom ref={this.myRef} ></AFrom> */}
      </div>
    )
  }
}

export default JoinHome