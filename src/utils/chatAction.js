
import AgoraRTM from 'agora-rtm-sdk'
import {Message} from 'antd'
// 登陆
export async function msgLogin(options) {
  try {
    const {appID, token, uid , aborted} = options
    const client = AgoraRTM.createInstance(appID);
    const res = await client.login({ token, uid })
    console.log('AgoraRTM client login success: info登陆成功',client);
    client.on('ConnectionStateChanged',  (newState, reason)=> {
      console.log('ConnectionStateChanged',newState, reason)
      if(newState === 'ABORTED') {
        aborted instanceof Function && aborted()
      }
    });
    return client
  } catch (error) {
    console.log('AgoraRTM client login failure', error);
    return {}
  }
  
}

// 创建并加入频道
export async function createChannel (client,channelNum , fn, ) {
  // console.log(`加入频道${channelNum}成功:`,client)
  const channel = client.createChannel(channelNum); // 
  try{
    const res = await channel.join()
    console.log(`加入频道${channelNum}成功`)
    channel.on('ChannelMessage', ({ text }, senderId) => { // text 为收到的频道消息文本，senderId 为发送方的 User ID
      /* 收到频道消息的处理逻辑 */
      console.log('消息接收成功:', text,senderId ,typeof fn ==='function')
      typeof fn ==='function' && fn(text)
    });
    console.log('channel',channel)
    return channel
  }catch(error){
    console.log(`加入频道${channelNum}失败:${error}`)
    Message.error(`加入聊天失败:${error}`)
    return {}
  }
}

// 发送消息
export const sendMessage = (channel, text)=>{
  channel && channel.sendMessage({ text }).then(() => {
    /* 频道消息发送成功的处理逻辑 */
    console.log('频道消息发送成功')
  }).catch(error => {
    /* 频道消息发送失败的处理逻辑 */
    console.log('频道消息发送失败',error)
  });
}