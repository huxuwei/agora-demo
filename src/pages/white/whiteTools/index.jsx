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
      {text: 'selector',icon: 'iconshubiao' },
      {text: 'pencil',icon: 'iconhuabi' },
      {text: 'rectangle',icon: 'iconkuangxuan' },
      {text: 'ellipse',icon: 'iconyuanxingkuangxuan' },
      {text: 'eraser',icon: 'iconxiangpica' },
      {text: 'text',icon: 'iconshuruwenzi' },
      {text: 'clear',icon: 'iconshanchu'},
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
        <div className='tools-wrap-content'>
          {
            list.map((item, i) => 
              <Button size='small' type='link' key= {item.text} 
                onClick= {()=>{changeTool(item,i)}}>
                <GIcon width='20px' height='20px' color= {i===activeIndex?'#95AAFE':'#5F5F5F'}  
                  icon={item.icon}></GIcon>
              </Button>
            )
          }
        </div>
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