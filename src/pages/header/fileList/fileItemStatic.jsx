
import React from 'react'
import {connect} from 'react-redux'
import http from '@/utils/request'

class FileItem extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeIndex: -1,
      list: []
    }
  }
  componentDidMount() {
    console.log('this.props.roomInfo',this.props.roomInfo)
    const { id: roomId, userInfo: { id:userId}} = this.props.roomInfo
    const params ={roomId, userId}
    http.get('getCourseware',params).then(res=>{
      this.setState({
        list: res.data.ordinary
      })
    })
  }
  choose(item, i) {
    this.setState({
      activeIndex: i
    })
    this.pptShow(item,i)
  }

  pptShow(item,i) {
    const {whiteRoom: room } = this.props
    // scenes 就是用来创建 pptx 对应的场景的描述信息
    var scenes = item.coursewares.map((item, i)=>{
      return {
        name: i,
        ppt: {
          ...item,
          src:'https://live.boluozaixian.net/'+ item.conversionFileUrl
        }
      }
    });
    console.log('scenes',scenes)

    // 为这个 ppt 文件起一个独一无二的名字。
    // 如果你的白板中可能出现多个 ppt，这样有助于管理它们。
    var pptName = item.name.split('.')[0];
    console.log("pppp:", "/" + pptName, scenes);
    // // 将 ppt 对应的场景插入白板
    room.putScenes("/" + pptName, scenes);
    
    // 切换当前场景到 ppt 的第一页，这样才能显示出来
    room.setScenePath("/" + pptName + "/" + scenes[0].name);
  }
  render() {
    let {activeIndex, list } = this.state
    return (
      <div className="file-list-item-wrap">
        {
          list.map((item, i)=>
          <div key={i}
            className= { i === activeIndex ? 'active file-list-item': 'file-list-item'}
            onClick={()=>{this.choose(item,i)}}>
            <span>{item.name}</span>
          </div>
          )
        }
        
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    whiteRoom: state.whiteRoom,
    roomInfo: state.roomInfo
  }
}

export default connect(mapStateToProps)(FileItem) 