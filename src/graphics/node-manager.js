class NodeManager {
  static X_UNIT = 1.5;
  static Y_UNIT = 1.5;

  constructor() {
    this.graphics = new Map();
  }

  loadNodes(dataContainer, scene) {
    this.clear();
    let ad = dataContainer.nodes;
    
    ad.forEach((node, index) => {
      if (typeof index != "string") {
        this.addTextBlock(node, scene);
      }
      
    });
  }

  clear() {
    this.graphics.forEach((g) => {
      g.at.dispose();
      g.plane.dispose();
    });
    this.graphics = new Map();
  }

  addTextBlock(node, scene) {
    let plane = BABYLON.MeshBuilder.CreatePlane("textplane", 
      {width: 1.3, height: 1}, scene);

    plane.position.x = node.y * NodeManager.X_UNIT;
    plane.position.y = node.x * NodeManager.Y_UNIT;
    plane.position.z = 0;


    let at = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(
      plane, 512, 512);

    var rectangle = new BABYLON.GUI.Rectangle("rect");
    rectangle.width  ="1024px";
    rectangle.height = "1024px";
    // rectangle.color = "Orange";
    rectangle.background = "green";
    at.addControl(rectangle);

    var tb = new BABYLON.GUI.TextBlock();
    tb.text = node.text;
    tb.node = node;
    tb.color = "white";
    tb.fontSize = "120px";
    tb.textWrapping = true;
    tb.width = 2.5;
    tb.scaleX = 0.4;
    // text.scaleY = 1.5;
    let g = {
      plane: plane,
      at: at,
      textBlock: tb
    }
    this.graphics.set(node.id, g);

    at.addControl(tb);
    plane.nodeId = node.id;
  }

  editText(node) {
    let tb = this.graphics.get(node.id).textBlock;
    tb.text = node.text;
  }



  // disposeTextBlock() {
  //   if (this.at != undefined) {
  //     this.at.dispose();
  //     this.at = undefined;
  //   }
  // }

}