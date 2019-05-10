


class LoadNodesState {
  constructor(elon) {
    this.elon = elon;

    let dataCont = elon.dataManager.embedCoordinates();
    let visibleMetas = elon.nodeManager.loadNodes(dataCont, elon.scene);
    elon.lines.drawLines(elon.scene, dataCont, visibleMetas);

    new IdleState(elon);
  }

  update(delta) {
    
  }

}