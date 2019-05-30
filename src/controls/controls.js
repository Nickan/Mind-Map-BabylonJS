


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

  onPointerUp(scene, onPointerUpFn) {
    scene.onPointerUp = (event, pickResult) => {
      scene.onPointerUp = undefined;
      onPointerUpFn();
    }
  }

  initCreateChildState(scene, changeStateFn) {
    scene.onPointerUp = (event, pickResult) => {
      scene.onPointerUp = undefined;
      changeStateFn(new IdleState());
    }
  }


  createInputText(node, cbEnteredText) {
    if (this.input != undefined) {
      return;
    }

    let input = new BABYLON.GUI.InputText();
    this.input = input;
    input.width = 0.3;
    input.top = "45%";
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
    this.at.moveFocusToControl(input);
  }

  disposeInput() {
    if (this.input != undefined)
      this.input.dispose();

    if (this.at != undefined)
      this.at.dispose();
    this.at = undefined;

    this.input = undefined;
  }

  onFoldDescendants(cbFn, scene) {
    scene.onKeyboardObservable.add((keyInfo) => {
      const KEY_UP = 2;
      if (keyInfo.type == KEY_UP)
          return;
      
      let code = keyInfo.event.code;
      switch (code) {
        case "F3":
          cbFn();
          break;
      }
    });  
  }

  onFoldAncestors(cbFn, scene) {
    scene.onKeyboardObservable.add((keyInfo) => {
      const KEY_UP = 2;
      if (keyInfo.type == KEY_UP)
          return;
      
      let code = keyInfo.event.code;
      switch (code) {
        case "F4":
          cbFn();
          break;
      }
    });  
  }

  clear(scene) {
    scene.onKeyboardObservable.clear();
  }


  initKeyboard(elon) {
    let scene = elon.scene;
    this.clear(scene);

    this.shiftIsPressed = true;

    scene.onKeyboardObservable.add((keyInfo) => {
      const KEY_UP = 2;
      let key = keyInfo.event.key;
      if (keyInfo.type == KEY_UP) {
        switch (key) {
          case "Shift":
            this.shiftIsPressed = false;
            break;
        }
        return;
      }
      
      
      switch (key) {
        case "Shift":
          this.shiftIsPressed = true;
          break;
        case "s":
        case "S":
          if (this.shiftIsPressed) {
            elon.dataManager.save();
            if (this.onSave != undefined)
              this.onSave();
          }
          break;
        case "o":
        case "O":
          if (this.shiftIsPressed) {
            elon.dataManager.open(() => {
              new LoadNodesState(elon);
            })
            if (this.onOpen != undefined)
              this.onOpen();
          }
          break;
      }
    });
  }

  handleEdit(elon, node, cbFn) {
    let ctrl = elon.controls;
    ctrl.createInputText(node, 
      function enteredText(text) {
        node.text = text;
        elon.nodeManager.editText(node);
        elon.dataManager.editText(node.id, text);
        console.log("Test");
        cbFn();
      }
    );
  }
  
}