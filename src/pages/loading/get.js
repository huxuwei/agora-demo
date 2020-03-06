var videoplay = document.querySelector('video#player')
console.log('start')

//设备的展示与选择
var audioSource = document.querySelector("select#audioSource");
var audioOutput = document.querySelector("select#audioOutput");
var videoSource = document.querySelector("select#videoSource");
function gotDevices(deviceInfos) {      //参数deviceInfos是设备信息的数组
    console.log('deviceInfos',deviceInfos)
    deviceInfos.forEach((deviceInfo) => {
       console.log(deviceInfo.kind + ':label = ' + deviceInfo.label + ':id = ' + deviceInfo.deviceId + ':groupId = ' + deviceInfo.groupId);
       var option = document.createElement('option');
       option.value = deviceInfo.deviceId;
       option.text = deviceInfo.label;
       if(deviceInfo.kind === 'audioinput'){       //deviceInfo.kind来判断种类;音频
           audioSource.appendChild(option);
        console.log(11111,option)
       }else if(deviceInfo.kind === 'audiooutput'){        //音频输出
           audioOutput.appendChild(option);
           console.log(22222,option)
       }else if(deviceInfo.kind === 'videoinput' ){           //视频
           videoSource.appendChild(option);
        console.log(333333333,option)
       }

   });
}

//获取到流
function gotMediaStream (stream){
//    videoplay.srcObject = stream;
   return navigator.mediaDevices.enumerateDevices();   //成功获取流；并返回一个promise；用于后边对设备的判断
}

//错误处理
function handleError (err){
   console.log(err);
}

if( !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia ){
   console.log('getUserMedia is not support!')
}else{
   var constraints = {
       video : true,
       audio : true
   }
   navigator.mediaDevices.getUserMedia(constraints)
   .then(gotMediaStream)   //获取流
   .then(gotDevices)       //设备获取处理
   .catch(handleError);
}
// ————————————————
// 版权声明：本文为CSDN博主「Smile沛沛」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/qq_34273059/article/details/101053014