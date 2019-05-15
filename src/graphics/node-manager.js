class NodeManager {
  static X_UNIT = 1.5;
  static Y_UNIT = -1.5;

  constructor() {
    this.graphics = new Map();
    this.pool = new Pool();
  }

  loadNodes(dataContainer, scene) {
    this.clear(scene);
    let n = dataContainer.nodes;
    let m = dataContainer.metas;

    let vm = getVisibleMetas(m);

    vm.forEach((meta, id) => {
      let node = n.get(id);
      this.addTextBlock(node, scene);
    });
    return vm;

    function getVisibleMetas(metas) {
      let visibleMetas = new Map();
      let startingMeta = getMainMeta(metas);

      visibleMetas.set(startingMeta.id, startingMeta);
      addChildren(startingMeta, visibleMetas, metas);
      return visibleMetas;


      function addChildren(meta, visibleMetas, metas) {
        if (meta.foldDescendants != undefined && meta.foldDescendants) {
          return visibleMetas;
        } else {
          meta.childrenIds.forEach((cId) => {
            visibleMetas.set(cId, metas.get(cId));
            addChildren(metas.get(cId), visibleMetas, metas);
          });
          
        }
      }

      function getMainMeta(metas) {
        let main = undefined;
        metas.forEach((meta) => {
          if (meta.parentId == undefined) {
            main = meta;
          }
        });
        return main;
      }
    }
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
    }
  }

  addTextBlock(node, scene) {
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
      // + " : " + node.text; // For debugging
    tb.text = node.text;
    tb.node = node;
    
    this.graphics.set(node.id, nodeGraphics);

    at.addControl(tb);
    plane.nodeId = node.id;
  }

  editText(node) {
    let tb = this.graphics.get(node.id).textBlock;
    tb.text = node.text;
  }

  disposeGraphics() {
    this.pool.dispose();
  }

}