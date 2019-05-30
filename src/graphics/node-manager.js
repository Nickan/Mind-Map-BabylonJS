class NodeManager {
  static X_UNIT = 1.5;
  static Y_UNIT = -1.5;

  constructor() {
    this.graphics = new Map();
    this.pool = new Pool();
  }

  loadNodes(dataContainer, visibleMetas, scene) {
    this.clear(scene);
    let n = dataContainer.nodes;

    visibleMetas.forEach((meta, id) => {
      let node = n.get(id);
      this.addTextBlock(node, scene, meta.childrenIds.length);
    });
  }

  clear(scene) {
    this.graphics.forEach((ng, nodeId) => {
      scene.removeMesh(ng.plane); // Bugged, might be fixed in the future
      scene.meshes = Utils.removeElement(scene.meshes, ng.plane);
      this.pool.add(ng);
      reset(ng);
    });
    this.graphics = new Map();

    function reset(nodeGraphics) {
      nodeGraphics.plane.nodeId = -1;
      nodeGraphics.textBlock.node = undefined;
      nodeGraphics.textBlock.text = "";
      nodeGraphics.obb.parent = undefined;
      nodeGraphics.obb.isVisible = false;
    }
  }

  addTextBlock(node, scene, childrenCount) {
    let nodeGraphics = this.pool.get(scene);
    
    let plane = nodeGraphics.plane;
    scene.addMesh(plane);
    // scene.meshes.push(plane);
    let p = plane.position
    p.x = node.y * NodeManager.X_UNIT;
    p.y = node.x * NodeManager.Y_UNIT;
    p.z = 0;

    let at = nodeGraphics.advancedTexture;
    let tb = nodeGraphics.textBlock;
    // tb.text = node.id + ": " + node.text; // For debugging
    // tb.text = node.id + " : " + node.y + ": " + node.x 
    //   + " : " + node.text; // For debugging
    tb.text = node.text;
    // tb.text = node.id + " : " + p.x + ": " + p.y + " : " + node.text;
    tb.node = node;
    
    this.graphics.set(node.id, nodeGraphics);

    let obb = nodeGraphics.obb;
    obb.isVisible = true;
    obb.scaling.y = 1;
    obb.parent = plane;
    obb.position.x = NodeManager.X_UNIT;
    obb.isPickable = false;
    if (childrenCount > 1) {
      obb.scaling.y = Math.abs(childrenCount * NodeManager.Y_UNIT);
    }

    at.addControl(tb);
    plane.nodeId = node.id;
    // console.log("p.y " + p.y);
  }

  editText(node) {
    let tb = this.graphics.get(node.id).textBlock;
    tb.text = node.text;
  }

  disposeGraphics() {
    this.pool.dispose();
  }

}