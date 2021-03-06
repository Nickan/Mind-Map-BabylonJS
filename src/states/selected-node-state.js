


class SelectedNodeState {
  constructor(elon, data) {
    this.elon = elon;
    this.data = data;
    elon.controls.initKeyboard(elon);
    elon.state = this;
    

    this.controls = new SelectedControls(elon.scene, this.data);
    this.controls.onEdit(() => {
        this.exit();
        new EditNodeState(elon, this.data);
      })
      .onCreateChild(() => {
        this.exit();
        new CreateChildState(elon, this.data);
      })
      .onCreateSibling(() => {
        this.exit();
        new CreateSiblingState(elon, this.data);
      })
      .onSelectedNode((result) => {
        if (result.nodeId == this.data.nodeId)
          return;

        this.exit();
        new SelectedNodeState(elon, result);
      })
      .onDragScreen((result) => {
        this.exit();
        new DragScreenState(elon, result);
      })
      .onDeleteNode(() => {
        elon.dataManager.deleteNode(this.data.nodeId);
        Utils.redraw(elon);
        new IdleState(elon);
      });
    this.controls.nodeDragCb = () => {
      new DragNodeState(elon, this.data);
    }

    this.controls.toggleFoldDescendants = () => {
      elon.dataManager.toggleFoldDescendants(data.nodeId);
      Utils.redraw(elon);
    };

    this.controls.toggleFoldAncestors = () => {
      elon.dataManager.toggleFoldUnfoldAncestors(data.nodeId);
      Utils.redraw(elon);
    }
  }

  update(delta) {
    this.controls.update(delta);
  }

  exit() {
    this.controls.dispose();
    this.controls = undefined;
    this.elon.state = undefined;
    this.elon.controls.clear(elon.scene);
  }
}