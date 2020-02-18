const store = (state, action) => {
  if (state === undefined) {
    return {
      client: {},
      stream: {},
      whiteRoom: {},
      roomInfo: {},
      fileInfo: {},
      msgClient: {},
      channelOrder: {}
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
    case 'Set_channelOrder':
      newState = {
        ...state,
        channelOrder: action.payload
      }
      break;
    default:
      break;
  }
  return newState
}
export default store