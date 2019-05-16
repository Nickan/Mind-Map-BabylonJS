


class LoadNodesState {
  constructor(elon) {
    this.elon = elon;

    let dm = elon.dataManager;
    let result = dm.getVisibleMetas();
    let startingId = result[0];
    let vm = result[1];
    let vn = dm.getVisibleNodes(vm);
    dm.dataContainer.nodes = vn;
    dm.dataContainer.metas = vm;
    
    let dc = dm.embedCoordinates(startingId);
    
    elon.nodeManager.loadNodes(dc, vm, elon.scene);
    elon.lines.drawLines(elon.scene, dc, vm);

    new IdleState(elon);
  }

  update(delta) {
    
  }

}