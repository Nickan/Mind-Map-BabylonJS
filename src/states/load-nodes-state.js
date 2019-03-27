


class LoadNodesState {
  
  init() {
    let sm = this.stateManager;
    let main = sm.main;

    let dc = main.dataManager.embedCoordinates();
    main.nodeManager.loadNodes(dc, main.scene);
    // main.controls.init(dc, main.scene);
    sm.setState(new IdleState());
  }

  update(delta) {
    
  }

  exit() {
    
  }


}