class Utils {
  static createGroundFor3D2DConversion(scene) {
    let ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene, false);

    let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

    myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    ground.material = myMaterial;
    ground.material.alpha = 0;
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


// Camera
function rayCast(canvas, scene, cam) {
  scene.onPointerDown = function(event, pickResult) {
    console.log("pickResult " + pickResult.pickedPoint);
    console.log("worldVectorToScreen " + 
      worldVectorToScreen(pickResult.pickedPoint, cam, scene));
  }

}

function worldVectorToScreen(v, cam, scene){
  let iden = BABYLON.Matrix.Identity();
  let camera = cam || scene.activeCamera;

  let p = BABYLON.Vector3.Project(v, iden, scene.getTransformMatrix(),
              camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));

  return new BABYLON.Vector2(p.x, p.y);
}

function getActiveCamera() {

}

