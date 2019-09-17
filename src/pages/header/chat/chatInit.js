
import AgoraRTM from 'agora-rtm-sdk'

let channelA 
let  clientA

export function info(options={},fn) {
  console.log('options',options)
  const {appID, token, uid} = options
  const client = AgoraRTM.createInstance(appID);
  client.on('ConnectionStateChanged', (newState, reason) => {
    console.log('on connection state changed to ' + newState + ' reason: ' + reason);
  });
 

  
  clientA = client
  login(token, uid,fn)
  return client
}


function login(token, uid,fn) {
  clientA.login({ token, uid }).then(() => {
    console.log('AgoraRTM client login success: info登陆成功');
    createChannel(clientA,fn)
  }).catch(err => {
    console.log('AgoraRTM client login failure', err);
  });
}

export function createChannel (client, fn) {
  const channel = client.createChannel('8888'); // 

  channel.join().then(() => {
    /* 加入频道成功的处理逻辑 */
    console.log('加入频道成功')
  }).catch(error => {
    /* 加入频道失败的处理逻辑 */
  });
  channel.on('ChannelMessage', ({ text }, senderId) => { // text 为收到的频道消息文本，senderId 为发送方的 User ID
    /* 收到频道消息的处理逻辑 */
    console.log('消息接收成功:', text,senderId ,typeof fn ==='function')
    typeof fn ==='function' && fn(text)
  });
  channelA = channel
}


export const sendMessage = ( text)=>{
  channelA.sendMessage({ text }).then(() => {
    /* 频道消息发送成功的处理逻辑 */
    console.log('频道消息发送成功')
  }).catch(error => {
    /* 频道消息发送失败的处理逻辑 */
    console.log('频道消息发送失败',error)
  });
}