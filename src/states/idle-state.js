


class IdleState {
  init() {
    let sm = this.stateManager;
    let main = sm.main;

    this.handleSelectedNodeState(sm, main);
    this.handleDragNodeState(sm, main);
  }

  handleSelectedNodeState(sm, main) {
    main.scene.onPointerDown = (event, pickResult) => {
      if (pickResult == undefined)
        return;

      if (pickResult.pickedMesh.id == "textplane") {
        let m = pickResult.pickedMesh;
        let data = {
          selectedMesh: m,
          textBlock: m.textBlock,
          node: m.textBlock.node
        };
        main.scene.onPointerDown = undefined;
        sm.setState(new SelectedNodeState(data));
      }
        
    };
  }

  handleDragNodeState(sm, main) {

  }
}