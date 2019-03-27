


class StartState {

  init() {
    let sm = this.stateManager;
    let main = sm.main;
    let dm = main.dataManager;
    dm.clear();

    dm.addNewData("Main", undefined);
    sm.setState(new LoadNodesState());
  }

  update(delta) {
    
  }

  exit() {

  }
}