


class LoadNodesState {
  constructor(elon) {
    this.elon = elon;
    elon.state = this;

    Utils.redraw(elon);
    new IdleState(elon);
  }

  update(delta) {
    
  }

}