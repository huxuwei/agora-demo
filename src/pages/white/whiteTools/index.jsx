import React,{useState} from 'react'
import {Button } from 'antd'
import GIcon from '@/components/GIcon'
import {connect} from 'react-redux'

 class WhiteTools extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      activeIndex: 0
    }
    this.list = [
      {text: 'selector',icon: 'iconxuanze' },
      {text: 'pencil',icon: 'iconpencil' },
      {text: 'rectangle',icon: 'iconrectangle' },
      {text: 'ellipse',icon: 'iconellipse' },
      {text: 'eraser',icon: 'iconeraser1' },
      {text: 'text',icon: 'icontext1' },
      {text: 'clear',icon: 'iconclear'},
    ]
  }
  changeTool=(item,i)=> {
    const {room} = this.props
    if(item.text === 'clear'){
      room.cleanCurrentScene(true);
      return
    }
    this.setState({
      activeIndex: i
    })
    
    room.setMemberState({
      currentApplianceName: item.text
    });
  }
  render() {
    const {list, state:{activeIndex}, changeTool} = this
    return (
      <div className="tools-wrap">
        {
          list.map((item, i) => 
            <Button size='small' type='link' key= {item.text} 
              onClick= {()=>{changeTool(item,i)}}>
              <GIcon  color= {i===activeIndex?'rgb(236, 52, 85)':''}  
                icon={item.icon}></GIcon>
            </Button>
          )
        }
      </div>
    )
  }
  
}
function mapStateToProps(state){
  return {
    fileInfo: state.fileInfo,
    room: state.whiteRoom
  }
}

export default connect(mapStateToProps)(WhiteTools)