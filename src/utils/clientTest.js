import AgoraRTC from 'agora-rtc-sdk'

AgoraRTC.getDevices(function (devices) {
  var devCount = devices.length;

  var id = devices[0].deviceId;
  console.log('devices',devices)
}, function (errStr) {
  console.error("Failed to getDevice", errStr);
});