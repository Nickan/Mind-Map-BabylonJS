class CreateChildState {
  constructor(elon, data) {
    this.elon = elon;
    this.data = data;

    this.spawnChildNode(elon);
    // this.drawLines(elon);

    new CreateChildControls(elon.scene)
      .onSelectedNode((result) => {
        // Cancel the creation
        // Delete the temp node
        // Select the node
      })
      .onDragScreen((result) => {
        this.cancelCreation(elon);
      });
  }

  cancelCreation(elon) {
    // Revert back
    elon.controls.disposeInput();
    let dm = elon.dataManager;

    new IdleState(elon);
    if (dm.revertBack()) {
      Utils.redraw(elon);
    }
    
    
  }

  spawnChildNode(elon) {
    /*
      Need to get the coordinates
      Have to add it first to the list
      Then remove it later on if the creation is cancelled
    */
    let id = this.data.nodeId;
    let dm = elon.dataManager;

    let childNode = dm.addNewData("", id);
    Utils.redraw(elon);

    this.data.detectIfNodeOnDrag = false;
    this.handleEdit(elon, childNode, this.data);
    elon.scene.render(); // Have to remove later
  }

  drawLines(elon, dataContainer) {
    let dc = elon.dataManager.dataContainer;
    elon.lines.drawLines(elon.scene, dc);
  }

  handleEdit(elon, node, data) {
    let ctrl = elon.controls;
    ctrl.createInputText(node, 
      function enteredText(text) {
        node.text = text;
        elon.nodeManager.editText(node);
        new SelectedNodeState(elon, data);
      }
    );
  }


  update(delta) {
    
  }

  exit() {
    
  }
}