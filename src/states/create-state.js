


class CreateState {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.init();
  }

  init() {
    let main = this.stateManager.main;
    let dc1 = main.dataManager.embedCoordinates();
    let nm = new NodeManager(dc1, main.scene);
    let ctrl = new Controls(dc1, main.scene);
  }


}