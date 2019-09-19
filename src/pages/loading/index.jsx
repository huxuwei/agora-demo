import React , {useState, useEffect} from 'react'
import http from '@/utils/request'
import './index.less'
import Room from '@/pages/room'
import queryString from 'querystring'
import {Spin, Message } from 'antd'
import { connect } from "react-redux";
class LoadingStart extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      roomInfo: {},
      loading: true
    }
  }
  componentDidMount(){
    localStorage.clear();
    this.init()
  }
  init() {
    const { scheduleStr, crmUserStr, roleStr } = queryString.parse(window.location.hash.split('?')[1])
    const params = {
      scheduleStr,
      crmUserStr,
      roleStr
    }
    http.get("joinRoom", params).then(res => {
      const {agora, hereWhite} = res.data
    
      if(agora && hereWhite){
        this.props.Set_roomInfo(res.data)
        this.setState({
          loading: false,
          roomInfo: res.data
        })
      }
    })
  }
  render() {
    const {loading, roomInfo} = this.state
    return (
      <div className='loading-start'>
          {
            loading ? <Spin tip="正在初始化..."  size="large" spinning={loading}/> : <Room roomInfo={roomInfo}></Room>
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
    Set_roomInfo: (roomInfo)=> dispatch({type: 'Set_roomInfo', payload: roomInfo})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoadingStart)