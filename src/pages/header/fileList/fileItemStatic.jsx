
import React from 'react'
import {connect} from 'react-redux'
import http from '@/utils/request'

class FileItem extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeIndex: -1,
      list: [
        {
          name: 'init',
          coursewares: Array(20).fill(0).map(item=>{
            return {
              ppt: undefined,
            }
          }),
          url: 'init',
        }
      ]
    }
  }
  componentDidMount() {
    console.log('this.props.roomInfo',this.props.roomInfo)
    const { id: roomId, userInfo: { id:userId}} = this.props.roomInfo
    const params ={roomId, userId}
    http.get('getCourseware',params).then(res=>{
      this.setState({
        list: [...this.state.list, ...res.data.ordinary],
      })
      this.state.list.forEach((item,i)=>{

        if(i === 0){
          localStorage.setItem(item.name, 2)
        }
        if(localStorage.getItem(item.name)){
          localStorage.setItem(item.name, 1)
        }
        
      })
      
    })
  }
  componentDidUpdate(){
    // console.log('this.props.whiteRoom',this.props.whiteRoom)
    // if(this.props.whiteRoom.uuid){
    //   this.pptShow(this.state.list[0],0)
    // }
  }
  choose(item, i) {
    this.setState({
      activeIndex: i
    })
    this.pptShow(item,i)
  }

  pptShow(item,index) {
    const {whiteRoom: room } = this.props
    // scenes 就是用来创建 pptx 对应的场景的描述信息
    this.props.set_fileInfo(item)
   if(index === 0) {
    room.setScenePath("/init");
    return
   }

   
    var scenes = item.coursewares.map((item, i)=>{
      return {
        name: (i+1)+'',
        ppt: {
          ...item,
          src:'https://live.boluozaixian.net/'+ item.conversionFileUrl
        },
        fisrt: true
      }
    });

    if(index === 0) {
      scenes = scenes.map(item=>{
        return {name: item.name}
      })
    }
    // 为这个 ppt 文件起一个独一无二的名字。
    // 如果你的白板中可能出现多个 ppt，这样有助于管理它们。
    // var pptName = item.name.split('.')[0];
    var pptName = item.url

    console.log("pppp:", "/" + pptName, scenes);
    if(localStorage.getItem(item.name) == 1 ){
      room.putScenes("/" + pptName, scenes,0);
      localStorage.setItem(item.name, 2)
    }
    room.setScenePath("/" + pptName + "/" + scenes[0].name);
    // // 将 ppt 对应的场景插入白板
    
    
    // 切换当前场景到 ppt 的第一页，这样才能显示出来
    // let scenceState = room.state.sceneState;
    // console.log("scenceState", scenceState);
   
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
function maoDispathToProps(dispath) {
  return {
    set_fileInfo :(fileInfo)=>dispath({type:'Set_fileInfo',payload: fileInfo})
  }
}

export default connect(mapStateToProps, maoDispathToProps)(FileItem) 