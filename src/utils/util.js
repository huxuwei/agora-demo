export const throttle = (fn, wait = 50) =>{
  let previous = 0
  return function (...args) {
      let now = +new Date()
      if(now - previous > wait) {
          previous = now
          fn.apply(fn, args)
      }
  }
}


export function formatTime(msTime) {
  if(!msTime)return {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
  }

  let time = msTime /1000;

  let day = Math.floor(time /60 /60 /24);

  let hour = Math.floor(time /60 /60) %24;

  let minute = Math.floor(time /60) %60;

  let second = Math.floor(time) %60;

  return {
    day, hour, minute, second
  }

}

export function add0(val){
 if(val<10){
   return '0'+val
 }
 return val
}