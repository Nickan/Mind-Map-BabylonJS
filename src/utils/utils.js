



class Utils {
  static createGroundFor3D2DConversion(scene) {
    // let ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1000, scene, false);
    let ground = BABYLON.MeshBuilder.CreatePlane("ground", 
      {width: 100, height: 100});
    ground.position.z = 10;

    let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

    // myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    // myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    myMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    myMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
    myMaterial.ambientColor = new BABYLON.Color3(0, 0, 0);

    ground.material = myMaterial;
    ground.material.alpha = 1;
  }


  // Camera
  static rayCast(canvas, scene, cam) {
    scene.onPointerDown = function(event, pickResult) {
      console.log("pickResult " + pickResult.pickedPoint);
      console.log("worldVectorToScreen " + 
      Utils.worldVectorToScreen(pickResult.pickedPoint, cam, scene));
    }

  }

  static worldVectorToScreen(v, cam, scene){
    let iden = BABYLON.Matrix.Identity();
    let camera = cam || scene.activeCamera;

    let p = BABYLON.Vector3.Project(v, iden, scene.getTransformMatrix(),
                camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));

    return new BABYLON.Vector2(p.x, p.y);
  }
  
  static getMaxKey(map) {
    let max = 0;
    map.forEach((value, key) => {
      if (max < key) {
        max = key;
      }
    });
    return max;
  }

  static events = {};
  static ON_DRAG_SCREEN = 'ondragscreen';

  static addEventListener(name, handler) {
    if (Utils.events.hasOwnProperty(name))
      Utils.events[name].push(handler);
    else
      Utils.events[name] = [handler];
  }

  static removeEventListener(name, handler) {
    /* This is a bit tricky, because how would you identify functions?
      This simple solution should work if you pass THE SAME handler. */
    if (!Utils.events.hasOwnProperty(name))
      return;

    var index = Utils.events[name].indexOf(handler);
    if (index != -1)
      Utils.events[name].splice(index, 1);
  }

  static fireEvent(name, args) {
    if (!Utils.events.hasOwnProperty(name))
      return;

    if (!args || !args.length)
      args = [];

    var evs = Utils.events[name], l = evs.length;
    for (var i = 0; i < l; i++) {
      evs[i].apply(null, args);
    }
  }

  static clearListeners() {
    Utils.events = {};
  }

  // Controls
  static onSelectedNode(scene, pickResult, selectedNodeFn) {
    if (Utils.selectedNode(pickResult)) {
      let m = pickResult.pickedMesh;
      let result = {
        nodeId: m.nodeId
      };
      scene.onPointerDown = undefined;
      selectedNodeFn(result);
    }
  }

  static onDragScreen(scene, pickResult, onDragScreenFn) {
    if (dragGround(pickResult)) {
      let result = {
        pickedPoint: pickResult.pickedPoint,
      };
      scene.onPointerDown = undefined;
      onDragScreenFn(result);
    }

    function dragGround(pickResult) {
      let id = pickResult.pickedMesh.id;
      return (id != "textplane" && id == "ground");
    }
  }

  static TEXT_PLAIN = "textplane";
  static NO_TEXT_ID = -1;
  static onDragNode(scene, pickResult, fn) {
    let id = getSelectedNodeTextId(pickResult);
    if (id != Utils.NO_TEXT_ID) {
      fn();
    }

    function getSelectedNodeTextId(pickResult) {
      if (pickResult.pickedMesh.id == Utils.TEXT_PLAIN)
        return pickResult.pickedMesh.id;
      return Utils.NO_TEXT_ID;
    }
  }


  static getPickedMousePos(scene) {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    return pickResult.pickedPoint;
  }

  static POINTER_X = undefined;
  static POINTER_Y = undefined;
  static mousePosHasChanged(scene) {
    if (Utils.POINTER_X != scene.pointerX) {
      Utils.POINTER_X = scene.pointerX;
      return true;
    }

    if (Utils.POINTER_Y != scene.pointerY) {
      Utils.POINTER_Y = scene.pointerY;
      return true;
    }

    return false;
  }



  static selectedNode(pickResult) {
    return (pickResult.pickedMesh.id == "textplane");
  }

  static update(delta) {

  }


  static removeElement(array, element) {
    var index = array.indexOf(element);
    if (index !== -1) 
      array.splice(index, 1);
    return array;
  }


  // Math
  static insideDist(x1, y1, x2, y2, dist) {
    let d = Utils.getDistSqr(x1, y1, x2, y2);
    return (d < (dist * dist));
  }

  static insideDist2(p1, p2, dist) {
    let d = Utils.getDistSqr(p1.x, p1.y, p2.x, p2.y);
    return d < (dist * dist);
  }

  static getDistSqr(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return (dx * dx) + (dy * dy);
  }

  static getDistSqr2(p1, p2) {
    return Utils.getDistSqr(p1.x, p1.y, p2.x, p2.y);
  }

  static getDistSqr2Node(node1, node2) {
    let p1 = node1.plane.position;
    let p2 = node2.plane.position;
    return Utils.getDistSqr2(p1, p2);
  }

  static redraw(elon) {
    let dm = elon.dataManager;
    let result = dm.getVisibleMetas();
    let startingId = result[0];
    let vm = result[1];
    let vn = dm.getVisibleNodes(vm);
    dm.dataContainer.nodes = vn;
    dm.dataContainer.metas = vm;
    
    let dc = dm.embedCoordinates(startingId);
    
    elon.nodeManager.loadNodes(dc, vm, elon.scene);
    elon.lines.drawLines(elon.scene, dc, vm);

    // if (elon.nodeManager.graphics.get(2) != undefined) {
    //   let p = elon.nodeManager.graphics.get(2).plane.position;
    //   elon.cameraManager.setCenter(p);
    // }
    
  }

}











function makeElementDraggable(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function getElementById(id) {
  return document.getElementById(id);
}

function getElementsByClassName(cName) {
  return document.getElementsByClassName(cName);
}

function getElementLeftRatioToWindow(element) {
  let pos = parseFloat(element.style.left.replace("px"));
  let wWidth = parseFloat(window.innerWidth);
  let ratio = pos / wWidth;
  if (!Number.isNaN(ratio)) {
    return ratio;
  }
  return 0;
}

function getActiveCamera() {

}

