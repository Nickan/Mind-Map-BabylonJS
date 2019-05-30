


class SelectedNodeState {
  constructor(elon, data) {
    this.elon = elon;
    this.data = data;
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
        this.exit();
        elon.dataManager.deleteNode(this.data.nodeId);
        new LoadNodesState(elon);
      });
    this.controls.nodeDragCb = () => {
      new DragNodeState(elon, this.data);
    }

    this.controls.toggleFoldDescendants = () => {
      elon.dataManager.toggleFoldDescendants(data.nodeId);
      new LoadNodesState(elon);
    };

    this.controls.toggleFoldAncestors = () => {
      elon.dataManager.toggleFoldUnfoldAncestors(data.nodeId);
      new LoadNodesState(elon);
    }

    elon.controls.initKeyboard(elon);
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