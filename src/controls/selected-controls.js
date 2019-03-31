


class SelectedControls {
  constructor(scene, data) {
    this.scene = scene;

    scene.onKeyboardObservable.add((keyInfo) => {
      const KEY_UP = 2;
      if (keyInfo.type == KEY_UP)
          return;
      
      let code = keyInfo.event.code;
      switch (code) {
        case "F2":
          if (data.nodeId != undefined)
            this.edit(scene);
        // case "Enter": 
        //   this.createSibling();
        //   break;
        case "Tab":
          this.createChild();
          break;
        case "Delete":
          this.deleteNode();
          break;
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
    this.onDeleteNode(() => {});
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

  onDeleteNode(fn) {
    this.deleteNode = fn;
    return this;
  }

  dispose() {
    this.scene.onKeyboardObservable.clear();
    this.scene.onPointerDown = undefined;
    this.scene.onPointerUp = undefined;
  }
  
}