class CreateChildState {
  constructor(data) {
    this.data = data;
  }

  init() {
    /*
      Initialize controls
        In progress...
      Spawn a potential child node
      Set it as editable
      When enter is pressed
        Create the node
      Else
        Delete the potential node
      Pts: 10
      Target: 10
    */
    let sm = this.stateManager;
    let main = sm.main;
    this.spawnChildNode(sm, main);
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

    // let data = {
    //   parentNode: this.data.node,
    //   childNode: childNode,
    //   selectedNode: this.data.node
    // };
    // sm.setState(new LoadNodesState(data));
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