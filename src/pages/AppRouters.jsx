import * as React from "react";
import {Route, HashRouter } from 'react-router-dom'
import JoinRoom from './JoinRoom/index'
import Room from './room/index'
import Replayer from './replayer/index'

export default class AppRoutes extends React.Component{
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  render() {
    return (
      <HashRouter>
        <Route exact path='/' component={JoinRoom} />
        <Route path='/room' component={Room} />
        <Route path='/replayer' component={Replayer} />
      </HashRouter>
    )
  }

}