import React from 'react'
import { Pagination } from 'antd';
import {connect} from 'react-redux'

class WhiteAction extends React.Component {
  constructor(props){
    super(props)
    this.state={
      total: 0,
      current: 1
    }
  }
  componentDidMount() {
    // this.props.room.removeScenes("/");
    // 重新进入教室,计算总页数及当前页数
    let scenceState = this.props.room.state.sceneState;
    console.log('scenceState',scenceState)
    const pageNow = scenceState.index +1
    this.setState({
      total: scenceState.scenes.length ,
      current: pageNow
    })
  }
  // static getDerivedStateFromProps(prevProps,state) {
  //   console.log('getDerivedStateFromProps',prevProps,state)
  //   return {
  //     current: 1
  //   }
  // }
  componentWillUpdate(val) {
    //  每次切换文件的都跳到第一页
    if(val.fileInfo.key !== this.props.fileInfo.key){
      this.setState({
          current: 1
        })
    }
  }
  // 切换场景
  onChange(page, pageSize) {
    this.setState({
      current: page
    })
    let scenceState = this.props.room.state.sceneState;
    const pptName = scenceState.scenePath.split('/')[1]
    this.props.room.setScenePath("/" + pptName + "/" + page);
  }

  render() {
    const {total,current } = this.state
    const {totalPageSize} = this.props.fileInfo

    return (
      <div className='white-action-wrap'>
        <Pagination hideOnSinglePage simple current={current} pageSize={1} total={totalPageSize ?totalPageSize :total} 
          onChange={(page, pageSize)=>{this.onChange(page, pageSize)}}/>
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

export default connect(mapStateToProps)(WhiteAction) 