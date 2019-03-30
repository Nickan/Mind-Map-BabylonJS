


class LoadNodesState {
  constructor(data = {}) {
    this.data = data; //* Seems not being used here, can be used later
    // For choosing the focused node
    // 
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;

    let dc = main.dataManager.embedCoordinates();
    main.nodeManager.loadNodes(dc, main.scene);
    sm.setState(new IdleState(this.data));
  }

  update(delta) {
    
  }

  exit() {
    let main = this.stateManager.main;
    main.lines.dispose();
  }


}