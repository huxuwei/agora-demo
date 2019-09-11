const room = 'online-classroom'
const apis = {
    // 获取select信息
    room: room + '/uuid',
    // 加入房间
    joinRoom: room + '/getJoinRoomInfo',
    // 上课
    roomStart: room + '/start',
    // 下课
    roomStop: room + '/stop',
    // 获取房间信息
    roomInfo: room + '/info',
    // 媒体文件播放
    roomUpdateLayout: room + '/updateLayout',
    // 加入屏幕分享
    addInjectStream: room + '/addInjectStream',
    // 获取文件
    getCourseware: room + '/getCourseware'

}
export const getApi = key => apis[key];