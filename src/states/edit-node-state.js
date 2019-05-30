class EditNodeState {
  constructor(elon, data) {
    let node = elon.dataManager.dataContainer.defaultNodes.get(data.nodeId);
    elon.controls.handleEdit(elon, node, () => {
      new IdleState(elon, data);
    });
  }

  update(delta) {
    
  }
}