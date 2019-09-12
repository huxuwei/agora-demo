import React from 'react'
import { Pagination } from 'antd';
import {connect} from 'react-redux'

class WhiteAction extends React.Component {
  constructor(props){
    super(props)
    this.state={
      pageNum: 1,
      total: 0,
      current: 1
    }
    this.page = 1
  }
  componentDidMount() {
    // this.props.room.removeScenes("/");
    let scenceState = this.props.room.state.sceneState;
    const pageNow = scenceState.index +1
    this.setState({
      total: scenceState.scenes.length+10,
      current: pageNow
    })
    this.page = pageNow
    console.log('scenceState', scenceState)
  }
  componentDidUpdate(val) {
    this.current = 1
  }
  onChange(page, pageSize) {
    // room.setScenePath("/" + pptName + "/" + scenes[0].name);
    // console.log(1111111, page, pageSize)
    // console.log(this.page , page)
    // this.props.room.setScenePath("/init/"+page);
    this.setState({
      current: page
    })
    if(this.page + 1 === page){
      this.props.room.pptNextStep()
    }else if(this.page - 1 === page){
      this.props.room.pptPreviousStep()
    }

    let scenceState = this.props.room.state.sceneState;
    // console.log("scenceState", scenceState);
    this.page = page
  }
  render() {
    const {pageNum,total,current } = this.state
    const {totalPageSize} = this.props.fileInfo
    console.log('totalPageSize',totalPageSize,total)
    return (
      <div className='white-action-wrap'>
        <Pagination simple current={current} pageSize={1} total={totalPageSize ?totalPageSize :total} 
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