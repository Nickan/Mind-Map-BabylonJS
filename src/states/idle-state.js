


class IdleState {
  init() {
    let sm = this.stateManager;
    let main = sm.main;

    main.controls.initIdleState(main.scene, (newState) => {
      sm.setState(newState);
    });
  }

  dragNodeStateDown(pickResult) {
    let id = pickResult.pickedMesh.id;
    /*
      When there is no selected mesh, go to DragNodeState
    */
    if (id == "textplane")
      return;

    if (id == "ground") {
      let worldCoord = pickResult.pickedPoint;
      this.currentPos = worldCoord;
      this.onDrag = true;
    }
  }

  dragNodeStateUp(pickResult) {
    let worldCoord = pickResult.pickedPoint;
    this.currentPos = worldCoord;
  }

  update(delta) {
    
  }

  exit() {
  }
}