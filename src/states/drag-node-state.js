


class DragNodeState {
  constructor(elon, data) {
    this.elon = elon;
    this.data = data;

    elon.state = this;
    this.init(elon);
  }

  init(elon) {
    let ng = elon.nodeManager.graphics.get(this.data.nodeId);
    let nPos = ng.plane.position;
    let mPos = Utils.getPickedMousePos(elon.scene);

    this.nodePosRelativeToMouse = {
      x: mPos.x - nPos.x,
      y: mPos.y - nPos.y
    };

    this.potentialParent = undefined;
    this.potentialNodeId = -1;

    this.exceptions = elon.dataManager.getDescendants(this.data.nodeId);
    this.exceptions.push(this.data.nodeId);


    this.controls = new DragNodeControls(elon.scene, this.data);
    this.controls.dragStopCb = () => {
      console.log("Stop");
      new IdleState(elon, this.data);
    };
  }

  update(delta) {
    let elon = this.elon;
    let mPos = Utils.getPickedMousePos(elon.scene);

    let ng = elon.nodeManager.graphics.get(this.data.nodeId);
    let nPos = ng.plane.position;

    nPos.x = mPos.x - this.nodePosRelativeToMouse.x;
    nPos.y = mPos.y - this.nodePosRelativeToMouse.y;

    let nodesG = elon.nodeManager.graphics;

    let metas = elon.dataManager.dataContainer.metas;
    let p = getPotentialParent(ng, nodesG, metas, 
      this.exceptions);
    if (p != undefined && this.potentialNodeId != p.nodeId) {
      this.potentialNodeId = p.nodeId;
      elon.dataManager.changeParent(this.data.nodeId, p.nodeId);
      Utils.redraw(elon);
    }

    function getPotentialParent(draggedG, nodesG, metas, exceptions) {
      let potentialParent;
      let distDetector = 1.75;
      let minDist = 9999;

      let cloneM = _.cloneDeep(metas);
      exceptions.forEach((nodeId) => {
        cloneM.delete(nodeId);
      });

      cloneM.forEach((meta, nodeId) => {
        let nodeG = nodesG.get(nodeId);
        let d = draggedG.plane.position;
        let n = nodeG.plane.position;

        if (isPotentialParent(d, n)) {
          
          // Using their center
          let dSqr = Utils.getDistSqr2(d, n);

          // console.log(dSqr);
          let distDSqr = distDetector * distDetector;
          if (dSqr < distDSqr) {
            if (minDist > dSqr) {
              potentialParent = nodeG;
              potentialParent.nodeId = nodeId;
              minDist = dSqr;
            }
          }
        }
      });
      return potentialParent;

      function isPotentialParent(d, n) {
        return (d.x > n.x);
      }
    }
  }

  exit() {

  }
}