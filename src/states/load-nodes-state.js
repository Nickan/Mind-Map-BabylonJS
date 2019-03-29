


class LoadNodesState {
  constructor(data = {}) {
    this.data = data;
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
    
  }


}