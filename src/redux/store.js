const store = (state, action) => {
  // if(state === undefined){
  //   return {n: 0}
  // }else{
  //   if(action.type === 'add'){
  //     var newState = {n: state.n + action.payload}
  //     return newState
  //   }else{
  //     return state
  //   }
  // }
  console.log('action111111',action)
  if (state === undefined) {
    return {
      client: {},
      stream: {},
      whiteRoom: {},
      roomInfo: {},
      fileInfo: {},
      msgClient: {}
    }
  }
  let newState = {}
  console.log('action',action)
  switch (action.type) {
    case 'Set_client':
      newState = {
        ...state,
        client: action.payload
      }
      break;
    case 'Set_stream':
      newState = {
        ...state,
        stream: action.payload
      }
      break;
    case 'Set_whiteRoom':
      newState = {
        ...state,
        whiteRoom: action.payload
      }
      break;
    case 'Set_roomInfo':
      newState = {
        ...state,
        roomInfo: action.payload
      }
      break;
    case 'Set_fileInfo':
      newState = {
        ...state,
        fileInfo: action.payload
      }
      break;
    case 'Set_msgClient':
      newState = {
        ...state,
        msgClient: action.payload
      }
      break;
    default:
      break;
  }
  console.log('newState',newState)
  return newState
}
export default store