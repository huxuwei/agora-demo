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
  if (state === undefined) {
    return {
      client: {},
      stream: {},
      whiteRoom: {}
    }
  }
  let newState = {}
  switch (action.type) {
    case 'Set_client':
      newState = {
        ...state,
        client: action.payload
      }
      break;
    case 'SET_stream':
      newState = {
        ...state,
        stream: action.payload
      }
      break;
    case 'SET_whiteRoom':
      newState = {
        ...state,
        whiteRoom: action.payload
      }
      break;
      
    default:
      break;
  }
  return newState
}
export default store