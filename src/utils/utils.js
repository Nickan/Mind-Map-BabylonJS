



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

