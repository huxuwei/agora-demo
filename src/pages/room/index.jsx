/* eslint-disable no-useless-constructor */

import * as React from 'react'
import './index.less'
import WhiteRoom from '@/pages/white/index'
import VideoRoom from '@/pages/video'

export default class Room extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="room-page">
        <div className="room-page-main">
          <div className="room-page-left">
            <WhiteRoom props={this.props}></WhiteRoom>
          </div>
          <div className="videoWrap">
            <VideoRoom  props={this.props}></VideoRoom>
          </div>
        </div>
      </div>
    )
  }
}