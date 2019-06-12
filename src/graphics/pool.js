


class Pool {
  constructor() {
    this.pool = new Array();
  }
  
  get(scene) {
    let p = this.pool;
    if (p.length > 0)
      return p.pop();
    
    return this.newNodeGraphics(scene);
  }

  add(nodeGraphics) {
    this.pool.push(nodeGraphics);
  }

  dispose() {
    this.pool.forEach((nodeGraphics) => {
      nodeGraphics.plane.dispose();
      nodeGraphics.advancedTexture.dispose();
      nodeGraphics.textBlock.dispose();
      nodeGraphics.obb.dispose();
    });
    this.pool = new Map();
  }

  newNodeGraphics(scene) {
    let plane = BABYLON.MeshBuilder.CreatePlane("textplane", 
      {width: 1.3, height: 1}, scene);

    let d = this.newChildDetector(scene, plane);

    let at = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(
      plane, 512, 512);

    let rectangle = new BABYLON.GUI.Rectangle("rect");
    rectangle.width  ="1024px";
    rectangle.height = "1024px";
    // rectangle.color = "Orange";
    rectangle.background = "green";
    at.addControl(rectangle);

    let tb = new BABYLON.GUI.TextBlock();
    tb.color = "white";
    tb.fontSize = "120px";
    tb.textWrapping = true;
    tb.width = 2.5;
    tb.scaleX = 0.4;
    // text.scaleY = 1.5;

    at.addControl(tb);

    let nodeGraphics = {
      plane: plane,
      advancedTexture: at,
      textBlock: tb,
      obb: d
    }
    return nodeGraphics;
  }

  newChildDetector(scene, parent) {
    let mat = new BABYLON.StandardMaterial("mat", scene);
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    mat.wireframe = false;
    mat.alpha = 0.5;

    let d = BABYLON.Mesh.CreateBox("OBB", 1, scene);
    d.scaling = new BABYLON.Vector3(1.3, 1, -1);
    d.parent = parent;
    d.material = mat;
    return d;
  }


}