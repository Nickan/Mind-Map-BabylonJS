class EditNodeState {
  constructor(elon, data) {
    this.handleEdit(elon, data);
  }

  handleEdit(elon, data) {
    let node = elon.dataManager.dataContainer.defaultNodes.get(data.nodeId);
    elon.controls.createInputText(node, 
      function enteredText(text) {
        node.text = text;
        elon.nodeManager.editText(node, text);
        elon.dataManager.editText(data.nodeId, text);
        new IdleState(elon);
      }
    );
  }

  update(delta) {
    
  }
}