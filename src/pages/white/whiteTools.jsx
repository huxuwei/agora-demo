import * as React from 'react'
import { Button } from 'antd'
import './whiteTools.less'


export default class WhiteTools extends React.Component{
  constructor(props){
    super()
  }
  changeTool= val => {
    this.props.changeTool(val)
  }
  render() {
    return (
      <div className="tools-wrap">
        <Button size='small' type='text'  icon="cloud"  onClick={this.changeTool.bind(this,'pencil')}>
          {/* <g-icon class="icon" icon="iconpencil"></g-icon> */}
        </Button>
        <Button size='small' type="text"  icon="cloud" onClick={this.changeTool.bind(this,'rectangle')}>
          {/* <g-icon class="icon" icon="iconrectangle"></g-icon> */}
        </Button>
        <Button size='small' type="text"  icon="cloud" onClick={this.changeTool.bind(this,'ellipse')}>
          {/* <g-icon class="icon" icon="iconellipse"></g-icon> */}
        </Button>
        <Button size='small' type="text"  icon="cloud"  onClick={this.changeTool.bind(this,'eraser')}>
          {/* <g-icon class="icon" icon="iconeraser1"></g-icon> */}
        </Button>
        <Button size='small' type="text"  icon="cloud" onClick={this.changeTool.bind(this,'text')}>
          {/* <g-icon class="icon" icon="icontext1"></g-icon> */}
        </Button>
    </div>
    )
  }
}