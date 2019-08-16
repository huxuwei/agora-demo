const apis = {
    // 获取select信息
    room: 'room/uuid',
    // 加入房间
    roomName: '/room/join-room-info',
    // 上课
    roomStart: '/room/start',
    // 下课
    roomStop: '/room/stop',
    // 获取房间信息
    roomInfo: '/room/info',
    // 媒体文件播放
    roomUpdateLayout: '/room/updateLayout',

}
export const getApi = key => apis[key];