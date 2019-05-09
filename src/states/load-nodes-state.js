


class LoadNodesState {
  constructor(elon) {
    this.elon = elon;

    let dataCont = elon.dataManager.embedCoordinates();
    elon.nodeManager.loadNodes(dataCont, elon.scene);

    new IdleState(elon);
  }

  update(delta) {
    
  }

}