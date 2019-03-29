class CreateChildState {
  constructor(data) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;
    this.spawnChildNode(sm, main);

    new CreateChildControls(main.scene)
      .onSelectedNode((result) => {
        // Cancel the creation
        // Delete the temp node
        // Select the node
      })
      .onDragScreen((result) => {
        // Cancel creation
        // Delete the temp node
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

    this.handleEdit(sm, main, childNode);
    main.scene.render(); // Have to remove later
  }

  handleEdit(sm, main, node) {
    main.controls.createInputText(node, 
      function enteredText(text) {
        node.text = text;
        main.nodeManager.editText(node);
        sm.setState(new IdleState());
      }
    );
  }


  update(delta) {
    
  }

  exit() {
    
  }
}