class EditNodeState {
  constructor(data) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;

    this.handleEdit(sm, main);
  }

  handleEdit(sm, main) {
    let data = this.data;
    let node = main.dataManager.dataContainer.nodes.get(data.nodeId);
    main.controls.createInputText(node, 
      function enteredText(text) {
        node.text = text;
        main.nodeManager.editText(node, text);
        sm.setState(new IdleState());
      }
    );
  }

  update(delta) {
    
  }

  exit() {
    
  }
}