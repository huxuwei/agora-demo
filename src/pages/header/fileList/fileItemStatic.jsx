
import React from 'react'
import {connect} from 'react-redux'

class FileItem extends React.Component{
  constructor(props){
    super(props)
    this.white =  {
      name: '白板',
      coursewares: Array(20).fill(0).map(item=>{
        return {
          ppt: undefined,
        }
      }),
      key: 'init',
    }
    this.state = {
      activeIndex: -1,
      
      list: [
        
      ]
    }
  }
  componentDidMount(){
    this.setState({
      list: [this.white, ...this.props.fileList],
    })
    this.state.list.forEach((item,i)=>{
      if(i === 0){
        localStorage.setItem(item.name, 2)
      }
      if(localStorage.getItem(item.name)){
        localStorage.setItem(item.name, 1)
      }
      
    })
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.fileList.length !== nextProps.fileList.length ){
      this.setState({
        list: [this.white, ...nextProps.fileList],
      })
      this.state.list.forEach((item,i)=>{
        if(i === 0){
          localStorage.setItem(item.name, 2)
        }
        if(localStorage.getItem(item.name)){
          localStorage.setItem(item.name, 1)
        }
        
      })
    }
    
  }
  
  choose(item, i) {
    this.setState({
      activeIndex: i
    })
    this.pptShow(item,i)
  }
  pptShow(item,index) {
    const whiteWrapW= document.querySelector('#whiteWrap').clientWidth
    const whiteWrapH= document.querySelector('#whiteWrap').clientHeight
    console.log('clientWidth',whiteWrap.clientWidth,whiteWrapH)

    const {whiteRoom: room } = this.props
    // scenes 就是用来创建 pptx 对应的场景的描述信息
    this.props.set_fileInfo(item)
   if(index === 0) {
    room.setScenePath("/init");
    return
   }

   
  let scenes = item.coursewares.map((item, i)=>{
    return {
      name: (i+1)+'',
      ppt: {
        ...item,
        src: item.conversionFileUrl,
        width: whiteWrapW,
        height:whiteWrapH
      },
      fisrt: true
    }
  });
    // 为这个 ppt 文件起一个独一无二的名字。
    // 如果你的白板中可能出现多个 ppt，这样有助于管理它们。
    // var pptName = item.name.split('.')[0];
    var pptName = item.key+ ''

    console.log("pppp:", "/" + pptName, scenes);
    let first = localStorage.getItem(item.key)
    // 第一次点击课件时,将 ppt 对应的场景插入白板
    if(first == 1  || !first){
      room.putScenes("/" + pptName, scenes,0);
      localStorage.setItem(item.key, 2)
    }
    room.setScenePath("/" + pptName + "/" + scenes[0].name);
    
    
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
    roomInfo: state.roomInfo,
    whiteRoom: state.whiteRoom
  }
}
function maoDispathToProps(dispath) {
  return {
    set_fileInfo :(fileInfo)=>dispath({type:'Set_fileInfo',payload: fileInfo})
  }
}

export default connect(mapStateToProps, maoDispathToProps)(FileItem) 