


class StartState {

  constructor(elon) {
    this.elon = elon;
    elon.state = this;

    let dm = elon.dataManager;
    dm.clear();
    dm.addNewData("Main", undefined);
    new LoadNodesState(elon);
  }

  update(delta) {
    
  }

  exit() {

  }
}