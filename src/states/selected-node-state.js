


class SelectedNodeState {
  constructor(data) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;

    this.controls = new SelectedControls(main.scene, this.data);
    this.controls.onEdit(() => {
        sm.setState(new EditNodeState(this.data));
      })
      .onCreateChild(() => {
        sm.setState(new CreateChildState(this.data));
      })
      .onCreateSibling(() => {
        sm.setState(new CreateSiblingState(this.data));
      })
      .onSelectedNode((result) => {
        sm.setState(new SelectedNodeState(result));
      })
      .onDragScreen((result) => {
        sm.setState(new DragScreenState(result));
      })
      .onDeleteNode(() => {
        main.dataManager.deleteNode(this.data.nodeId);
        sm.setState(new LoadNodesState());
      });
    this.controls.nodeDragCb = () => {
      sm.setState(new DragNodeState(this.data));
    }
  }

  update(delta) {
    this.controls.update(delta);
  }

  exit() {
    this.controls.dispose();
  }
}