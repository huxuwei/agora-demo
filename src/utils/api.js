const apis = {
  // 获取select信息
  room: 'room/uuid',
  // 加入房间
  roomName: '/room/join-room-info',
  // 下课
  roomStop: '/room/stop',
  // 获取房间信息
  roomInfo: '/room/info'
}
export const getApi = key => apis[key];