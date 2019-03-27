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
    /* Show the InputText
      When text is entered:
        Dispose the InputText -> Handled by controls
        Edit the node.text
        Go back to idle state
    */
    let data = this.data;
    main.controls.createInputText(data, 
      function enteredText(text) {
        main.dataManager.editText(data.node, text);
        main.nodeManager.editText(data.textBlock, text);
        sm.setState(new IdleState());
      }
    );
  }
}