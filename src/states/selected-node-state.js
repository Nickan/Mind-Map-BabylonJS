


class SelectedNodeState {
  constructor(data) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;
    let sc = new SelectedControls(main.scene);
    this.sc = sc;
    sc.onEdit(() => {
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
      });
  }

  update(delta) {
    
  }

  exit() {
    this.sc.dispose();
  }
}