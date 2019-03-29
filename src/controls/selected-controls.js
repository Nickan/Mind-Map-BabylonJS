


class SelectedControls {
  constructor(scene) {
    this.scene = scene;

    scene.onKeyboardObservable.add((keyInfo) => {
      const KEY_UP = 2;
      if (keyInfo.type == KEY_UP)
          return;
      
      let code = keyInfo.event.code;
      switch (code) {
        case "F2":
          edit(scene, ctrl);
        case "Enter": 
          this.createSibling();
          break;
        case "Tab":
          this.createChild();
          break;
      }

      function edit(scene, ctrl) {
        if (data.selectedMesh == undefined)
          return;
        ctrl.edit();
      }

    });

    scene.onPointerDown = (event, pickResult) => {
      if (pickResult == undefined) return;

      Utils.onSelectedNode(scene, pickResult, this.selectedNodeFn);
      Utils.onDragScreen(scene, pickResult, this.dragScreenFn);
    }

    // Will change when node can be dragged
    // scene.onPointerUp = (event, pickResult) => {
    //   scene.onPointerUp = undefined;
    //   this.idle();
    // }

    function clear() {
      scene.onKeyboardObservable.clear();
      this.edit = undefined;
      this.createChild = undefined;
      this.createSibling = undefined;
    }

    this.onEdit(() => {});
    this.onCreateChild(() => {});
    this.onCreateSibling(() => {});
    this.onIdle(() => {});
    this.onSelectedNode((result) => {});
    this.onDragScreen((result) => {});
  }

  onEdit(fn) {
    this.edit = fn;
    return this;
  }

  onCreateChild(fn) {
    this.createChild = fn;
    return this;
  }

  onCreateSibling(fn) {
    this.createSibling = fn;
    return this;
  }

  onIdle(fn) {
    this.idle = fn;
    return this;
  }

  onSelectedNode(fn) {
    this.selectedNodeFn = fn;
    return this;
  }

  onDragScreen(fn) {
    this.dragScreenFn = fn;
    return this;
  }

  dispose() {
    this.scene.onKeyboardObservable.clear();
    this.scene.onPointerDown = undefined;
    this.scene.onPointerUp = undefined;
  }
  
}