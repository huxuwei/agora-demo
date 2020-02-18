import React from 'react'
import { connect } from 'react-redux'
import { talkingStatus } from '@/assets/data/talkingStatus'

class TalkingStatus extends React.Component {
	constructor() {
		super()
		this.state = {
			downlinkNetworkQuality: -99,
			uplinkNetworkQuality: -99
		}
		this.talkingStatus = {...talkingStatus, '-99':'网络质量检测中....'}
	}
	componentDidMount() {
		const { client } = this.props
		// 获取本地用户的上下行网络质量相关的统计数据
		client.on("network-quality", (stats) => {
			// console.log("下行网络质量打分： ", stats.downlinkNetworkQuality);
			// console.log("上行网络质量打分： ", stats.uplinkNetworkQuality);
			this.setState({
				downlinkNetworkQuality: stats.downlinkNetworkQuality,
				uplinkNetworkQuality: stats.uplinkNetworkQuality
			})
		});
	}
	
	render() {
		const {talkingStatus, state: { downlinkNetworkQuality, uplinkNetworkQuality } } = this
		return (
			<div>
				<p>下行网络质量: {talkingStatus[downlinkNetworkQuality]} </p>
				<p>上行网络质量: {talkingStatus[uplinkNetworkQuality]} </p>
				<span style={{color: '#ccc'}}>网络信息每 2 秒刷新</span>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		client: state.client,
		roomInfo: state.roomInfo
	}
}
export default connect(mapStateToProps)(TalkingStatus)