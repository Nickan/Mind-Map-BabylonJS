class CreateChildState {
  constructor(data) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;
    this.spawnChildNode(sm, main);
    this.drawLines(main);

    new CreateChildControls(main.scene)
      .onSelectedNode((result) => {
        // Cancel the creation
        // Delete the temp node
        // Select the node
      })
      .onDragScreen((result) => {
        this.cancelCreation(sm, main);
      });
  }

  cancelCreation(sm, main) {
    // Revert back
    main.controls.disposeInput();
    let dm = main.dataManager;
    if (dm.revertBack()) {
      let dc = dm.embedCoordinates();
      main.nodeManager.loadNodes(dc, main.scene);
      this.drawLines(main);
      main.scene.render();
    }
    
    sm.setState(new IdleState());
  }

  spawnChildNode(sm, main) {
    /*
      Need to get the coordinates
      Have to add it first to the list
      Then remove it later on if the creation is cancelled
    */
    let id = this.data.nodeId;
    let dm = main.dataManager;

    let childNode = dm.addNewData("", id);
    let dc = dm.embedCoordinates();
    main.nodeManager.loadNodes(dc, main.scene);

    this.handleEdit(sm, main, childNode, this.data);
    main.scene.render(); // Have to remove later
  }

  drawLines(main, dataContainer) {
    let dc = main.dataManager.dataContainer;
    main.lines.drawLines(main.scene, dc);
  }

  handleEdit(sm, main, node, data) {
    let ctrl = main.controls;
    ctrl.createInputText(node, 
      function enteredText(text) {
        node.text = text;
        main.nodeManager.editText(node);
        // sm.setState(new IdleState());
        sm.setState(new SelectedNodeState(data));
      }
    );
  }


  update(delta) {
    
  }

  exit() {
    
  }
}