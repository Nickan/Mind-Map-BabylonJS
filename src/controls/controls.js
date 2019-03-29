


class Controls {
  static ON_POINTER_DOWN = "onPointerDown";
  static ON_POINTER_UP = "onPointerUp";
  static ON_POINTER_OBSERVABLE = "onPointerObservable";
  static ON_MOUSE_SCROLL = "onMouseScroll";
  static ON_TEXT_ENTERED = "textEntered";
  static ON_DOUBLE_CLICKED = "onDoubleClicked";
  static ON_CREATE_NODE = "onCreateNode";

  static EDIT = "edit";
  static NEW_CHILD = "newChild";
  static NEW_SIBLING = "newSibling";

  constructor() {
  }

  onPointerDown(event, pickResult) {
    if (pickResult == undefined) {
      return;
    }

    if (pickResult.pickedMesh.id == "textplane") {
      this.selectedNodeMesh = pickResult.pickedMesh;
    }
  }

  createInputText(node, cbEnteredText) {
    if (this.input != undefined) {
      return;
    }

    let input = new BABYLON.GUI.InputText();
    this.input = input;
    input.width = 0.3;
    input.zIndex = 1;
    input.height = "40px";
    input.text = node.text;
    input.color = "white";
    input.background = "green";
    input.onKeyboardEventProcessedObservable.add((keyEvent) => {
      switch (keyEvent.code) {
        case "Enter":
          cbEnteredText(input.text);
          input.onKeyboardEventProcessedObservable.clear();
          this.disposeInput();
        break;
      }
    });

    this.at = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.at.addControl(input);
  }
  
  /*
    Per state in-depth controls
  */
  initIdleState(scene, changeStateFn) {
    scene.onPointerDown = (event, pickResult) => {
      if (pickResult == undefined)
        return;

      changeToSelectedNode(pickResult, changeStateFn);
      changeToDragNode(pickResult, changeStateFn);

      function changeToSelectedNode(pickResult, changeStateFn) {
        if (pickResult.pickedMesh.id == "textplane") {
          let m = pickResult.pickedMesh;
          let data = {
            nodeId: m.nodeId
          };
          scene.onPointerDown = undefined;
          changeStateFn(new SelectedNodeState(data));
        }
      }

      function changeToDragNode(pickResult, changeStateFn) {
        let id = pickResult.pickedMesh.id;
        if (id == "textplane") return;
        if (id == "ground") {
          let data = {
            pickedPoint: pickResult.pickedPoint,
          };
          scene.onPointerDown = undefined;
          changeStateFn(new DragScreenState(data));
        }
      }
    }

    scene.onPointerUp = (event, pickResult) => {
      if (pickResult == undefined)
        return;
    }

    
  }

  
  initSelectedState(data, changeStateFn) {
    let scene = data.scene;
    scene.onKeyboardObservable.add((keyInfo) => {
      let command = getCommand(keyInfo, data);

      switch (command) {
        case Controls.EDIT:
          changeStateFn(new EditNodeState(data));
        break;
        case Controls.NEW_CHILD:
          changeStateFn(new CreateChildState(data));
        break;
        case Controls.NEW_SIBLING:
          changeStateFn(new CreateSiblingState(data));
        break; 
      }

      scene.onKeyboardObservable.clear();

      function getCommand(keyInfo, data) {
        if (keyInfo.type == 2)
          return;
      
        let code = keyInfo.event.code;
        switch (code) {
          case "F2":
          if (data.selectedMesh != undefined)
            return Controls.EDIT;
          case "Enter": 
            return Controls.NEW_SIBLING;
          case "Tab":
            return Controls.NEW_CHILD;
        }
      }
    });

    // Will change when node can be dragged
    scene.onPointerUp = (event, pickResult) => {
      scene.onPointerUp = undefined;
      changeStateFn(new IdleState());
    }
  }

  initDragNodeState(scene, changeStateFn) {
    scene.onPointerUp = (event, pickResult) => {
      scene.onPointerUp = undefined;
      changeStateFn(new IdleState());
    }
  }

  initCreateChildState(scene, changeStateFn) {
    scene.onPointerUp = (event, pickResult) => {
      scene.onPointerUp = undefined;
      changeStateFn(new IdleState());
    }
  }


  disposeInput() {
    if (this.input != undefined)
      this.input.dispose();

    if (this.at != undefined)
      this.at.dispose();
    this.at = undefined;

    this.input = undefined;
  }

  
}