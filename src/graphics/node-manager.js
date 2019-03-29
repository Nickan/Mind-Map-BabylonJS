class NodeManager {

  // Based on data
  // Might be managed later on
  constructor() {
    this.nodeGraphics = new Map();
  }

  loadNodes(dataContainer, scene) {
    this.clear();
    let ad = dataContainer.nodes;
    
    ad.forEach((node, index) => {
      this.addTextBlock(node, scene);
    });
  }

  clear() {
    this.nodeGraphics.forEach((tb) => {
      tb.parent.dispose();
    });
    this.nodeGraphics = new Map();
  }

  addTextBlock(node, scene) {
    let xUnit = 1.5;
    let yUnit = 1.5;

    let plane = BABYLON.MeshBuilder.CreatePlane("textplane", 
      {width: 1, height: 1}, scene);

    plane.position.x = node.y * xUnit;
    plane.position.y = node.x * yUnit;

    this.at = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(
      plane, 1024, 1024);
    let at = this.at;

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
    tb.fontSize = "200px";
    tb.textWrapping = true;
    tb.width = 1.7;
    tb.scaleX = 0.6;
    // text.scaleY = 1.5;
    this.nodeGraphics.set(node.id, tb);

    at.addControl(tb);
    plane.nodeId = node.id;
  }

  editText(node) {
    let tb = this.nodeGraphics.get(node.id);
    tb.text = node.text;
  }

  // disposeTextBlock() {
  //   if (this.at != undefined) {
  //     this.at.dispose();
  //     this.at = undefined;
  //   }
  // }

}