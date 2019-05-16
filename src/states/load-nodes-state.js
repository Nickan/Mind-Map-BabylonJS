


class LoadNodesState {
  constructor(elon) {
    this.elon = elon;

    let dm = elon.dataManager;
    let vm = dm.getVisibleMetas();
    let vn = dm.getVisibleNodes(vm);
    dm.dataContainer.nodes = vn;
    dm.dataContainer.metas = vm;
    
    let dc = dm.embedCoordinates(1);
    
    elon.nodeManager.loadNodes(dc, vm, elon.scene);
    elon.lines.drawLines(elon.scene, dc, vm);

    new IdleState(elon);
  }

  update(delta) {
    
  }

}