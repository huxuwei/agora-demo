
// 上一页
export function pptPre(room) {
  room.pptPreviousStep()
}
// 下一页
export function pptNextStep(room) {
  room.pptNextStep()
}

// 只读模式
export function readOlny(room) {
  room.disableOperations = true;
  room.setViewMode(ViewMode.Follower);
}

/**
 * @param {Object} room 
 * @param {String} scence 
 * @param {String} name
 * 创建创景
 */
export function createWhite(room, scence, name) {
  room.putScenes(`/${scence}`, [{ name }]);
}

// 设置当前场景
export function setScenePath(room, scence, name) {
  room.setScenePath(`/${scence}/` + name);
}

// 创建并切换场景
export function createChangeScene(room, scence, name) {
  createWhite(room, scence, name)
  setScenePath(room, scence, name)
}

// 获取当前场景信息
export function getSceneState(room) {
  room.state.sceneState;
}
