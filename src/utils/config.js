
export const videoConfig= {
  mode: 'rtc',
  codec: 'h264',
  streamType: 1,// 设置大小流0: 高分辨率、高码率的视频大流  ,1: 低分辨率、低码率的视频小流,
  // // 获取录制视频的id接口
  // acquireURL: 'https://api.agora.io/v1/apps/<yourappid>/cloud_recording/acquire'
}


export const whiteConfig= {}
  
/**
 * 角色配置
 */
export const roleConifg= {
  teach: 1,
  stu: 2,
  course: 4,
  assistant: 5
}

/**
 * 频道参数
 */
const queryString = require('querystring')
export const channelConfig = (()=>{
  const scheduleStr = queryString.parse(window.location.hash.split('?')[1]).scheduleStr
  return {
    channel: scheduleStr, 
    channelChat: scheduleStr + '_8888',  //聊天频道
    channelOrder: scheduleStr + '_9999', //指令频道
  }
})()