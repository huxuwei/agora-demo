
export const videoConfig= {
  mode: 'rtc',
  codec: 'h264',
  streamType: 0,// 设置大小流0: 高分辨率、高码率的视频大流  ,1: 低分辨率、低码率的视频小流,
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

// 指令信息
export const orderMsgConfig = {
  video_leave: 'video_leave', //离开视频房间
  video_closeAudio: 'video_closeAudio', //关闭声音
  video_closeVideo: 'video_closeVideo', //关闭视频
  video_resume: 'video_resume',         // 恢复音视频
  
}

// export const roomConfig = {
//   time:2, //每次延长时间(分钟)
//   delayTime:5, //每次延长时间(分钟)
//   timeSec: function(){
//     return 1000 * 60 * this.time
//   }
// }

export const roomConfig = (() =>{
  const time = 2     // 提前请求延长的时间(分钟)
  const delayTime =5 //每次延长时间(分钟)
  return {
    time,
    delayTime, //每次延长时间(分钟)
    timeSec: 1000 * 60 * time
  }
})()