import React from 'react'
import { Row, Col, Select, Progress, Tabs } from 'antd'
import 'antd/dist/antd.css'
import './index.less'
const { Option } = Select
const { TabPane } = Tabs


class CheckAudio extends React.Component {
    constructor() {
        super()
        this.state = {
            audioinputList: [],
            audiooutputList: [],
            videoinputList: [],
            audioNumber: 0
        }
        this.videoPlay = React.createRef();
    }
    componentDidMount() {
        this.check()
        console.log(11111)
    }
    check = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true, })
            .then(this.gotMediaStream)
            .then(this.gotDevices)
    }

    //获取到流
    gotMediaStream = (stream) => {
        if (this.videoPlay.current) {
            this.videoPlay.current.srcObject = stream;
        }

        const audioContext = window.AudioContext || window.webkitAudioContext;
        const context = new audioContext(); //创建一个管理、播放声音的对象
        const liveSource = context.createMediaStreamSource(stream); //将麦克风的声音输入这个对象
        var levelChecker = context.createScriptProcessor(4096, 1, 1); //创建一个音频分析对象，采样的缓冲区大小为4096，输入和输出都是单声道
        liveSource.connect(levelChecker); //将该分析对象与麦克风音频进行连接
        levelChecker.connect(context.destination)
        levelChecker.onaudioprocess = (e) => { //开始处理音频
            var buffer = e.inputBuffer.getChannelData(0); //获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
            //创建变量并迭代来获取最大的音量值
            var maxVal = 0;
            for (var i = 0; i < buffer.length; i++) {
                if (maxVal < buffer[i]) {
                    maxVal = buffer[i];
                }
            }
            this.setState({
                audioNumber: Math.round(maxVal * 10)
            })
        }

        return navigator.mediaDevices.enumerateDevices();   //成功获取流；并返回一个promise；用于后边对设备的判断
    }

    gotDevices = (deviceInfos) => {
        deviceInfos.forEach(device => {
            if (device.kind === 'audioinput') {
                this.setState({
                    audioinputList: [...this.state.audioinputList, device]
                })
            } else if (device.kind === 'audiooutput') {
                this.setState({
                    audiooutputList: [...this.state.audiooutputList, device]
                })
            } else if (device.kind === 'videoinput') {
                this.setState({
                    videoinputList: [...this.state.videoinputList, device]
                })
            }
        })
    }
    render() {
        const { audioinputList, videoinputList, audioNumber, callback } = this.state
        return (
            <div >
                <Tabs defaultActiveKey="1"
                    className='check-devices'
                    onChange={this.check}
                    animated={false}
                    tabPosition='left'>
                    <TabPane tab="麦克风检测" key="1">
                        {/* 麦克风检测 */}
                        <div>
                            <Row className='choose-audio-input'>
                                <Col span={6}>麦克风选项</Col>
                                <Col span={18}>
                                    <Select value={audioinputList.length > 0 ? audioinputList[0].deviceId : 0}
                                        style={{ width: '100%' }}>
                                        {
                                            audioinputList.map(device => {
                                                const { deviceId, label } = device
                                                return (
                                                    <Option key={deviceId} value={deviceId}>{label}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={6}>
                                    <p className='choose-audio-input-label'>请选择正确的麦克风选项，选择禁用会导致麦克风不可用</p>
                                </Col>
                            </Row>
                            <div className='speak-label'>
                                对着麦克风从1数到10，您能听到自己的声音并且看到蓝条滚动吗？
                </div>
                            <Progress
                                steps={10}
                                size="small"
                                percent={audioNumber}>
                            </Progress>
                        </div>

                    </TabPane>
                    <TabPane tab="摄像头检测 " key="2">
                        {/* 摄像头检测 */}
                        <div>
                            <Row className='choose-audio-input'>
                                <Col span={6}>摄像头选项</Col>
                                <Col span={18}>
                                    <Select value={videoinputList[0] && videoinputList[0].deviceId}
                                        style={{ width: '100%' }}>
                                        {
                                            videoinputList.map(device => {
                                                const { deviceId, label } = device
                                                return (
                                                    <Option key={deviceId} value={deviceId}>{label}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            <video ref={this.videoPlay} width='300' height='300' autoPlay></video>
                        </div>
                    </TabPane>
                    <TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                </TabPane>
                </Tabs>
            </div>

        )
    }
}

export default CheckAudio