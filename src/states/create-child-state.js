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
    let id = this.data.node.id;
    let childNode = main.dataManager.addNewData("", id);

    let data = {
      parentNode: this.data.node,
      childNode: childNode
    };
    sm.setState(new LoadNodesState(data));
  }


  update(delta) {
    
  }

  exit() {
    
  }
}