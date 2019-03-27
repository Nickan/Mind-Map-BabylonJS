


class SelectedNodeState {
  constructor(data) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;

    // main.scene.onPointerUp = (event, pickResult) => {
    //   if (pickResult == undefined)
    //     return;
    // }
    
    this.handleDragState(sm, main);
    this.handleEditState(sm, main);
    // When clicked on the bg, drag state
    // When enter is pressed, create sibling
    // Won't work when main node is selected

    // When tab, create child
  }

  handleDragState(sm, main) {
    // Will be triggered when pointer up is not called
    // Will stop when pointer up is called
    // Will be retriggered when pointer is down
  }

  handleEditState(sm, main) {
    // When F2 is pressed, go the edit mode
    // Can't use pointer down again, as the user might decide
    // -it wants to drag the node

    // main.scene.onPointerDown = (event, pickResult) => {
    //   if (pickResult == undefined)
    //     return;

    //   if (pickResult.pickedMesh.id == "textplane") {
    //     console.log("Text double click");
    //   }
    // }

    main.scene.onKeyboardObservable.add((keyInfo) => {
      let data = this.data;
      if (validEditCommand(keyInfo, data)) {
        main.scene.onKeyboardObservable.clear();
        sm.setState(new EditNodeState(data));
      }
      

      function validEditCommand(keyInfo, data) {
        if (keyInfo.type == 2)
          return;
      
        let code = keyInfo.event.code;
        switch (code) {
          case "F2":
          if (data.selectedMesh != undefined)
            return true;
          break;
        }
      }
    });
  }

  exit() {
    
  }
}