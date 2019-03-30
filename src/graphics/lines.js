


class Lines {

  constructor() {

  }

  drawLines(scene, dataContainer) {
    this.dispose();
    let n = dataContainer.nodes;
    let m = dataContainer.metas;

    this.meshLines = [];

    let z = 1;
    n.forEach((value) => {
      let x = value.y * NodeManager.X_UNIT;
      let y = value.x * NodeManager.Y_UNIT;
      let p = new BABYLON.Vector3(x, y, z);

      let children = dataContainer.getChildren(value.id);

      children.forEach((child) => {
        let cx = child.y * NodeManager.X_UNIT;
        let cy = child.x * NodeManager.Y_UNIT;

        let c = new BABYLON.Vector3(cx, cy, z);
        let lines = [p, c];
        let mLine = BABYLON.MeshBuilder.CreateLines("lines", 
          { points: lines}, scene);
        this.meshLines.push(mLine);
      });
    });
    
  }

  dispose() {
    let m = this.meshLines;
    if (m != undefined) {
      m.forEach((value) => {
        value.dispose();
      })
      this.meshLines = undefined;
    }
  }
}