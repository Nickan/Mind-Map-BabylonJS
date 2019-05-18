


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
      elon.scene.onPointerUp = undefined;
      new IdleState(elon, this.data);
      Utils.redraw(elon);
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
    let p = getPotentialParent(ng, nodesG, metas, this.exceptions);
    if (p != undefined) {

      if (this.potentialNodeId != p.nodeId) {
        this.potentialNodeId = p.nodeId;
        elon.dataManager.changeParent(this.data.nodeId, p.nodeId);
      }
      
      Utils.redraw(elon);
    }

    if (this.potentialNodeId != -1) {
      let pNode = elon.nodeManager.graphics.get(this.potentialNodeId);
      let pMeta = metas.get(this.potentialNodeId);
      let l = getBreadthLevel(nPos, pNode, pMeta);
      console.log(l);
    }

    

    function getPotentialParent(draggedG, nodesG, metas, exceptions) {
      let potentialParent;
      let distDetector = 1.75;
      let minDist = 9999;

      let p = getPotentialParents(metas, getPotentialParent);

      p.forEach((meta, nodeId) => {
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

      function getPotentialParents(metas, fn) {
        if (fn.potentialParents == undefined) {
          fn.potentialParents = _.cloneDeep(metas);
          exceptions.forEach((nodeId) => {
            fn.potentialParents.delete(nodeId);
          });
        }
    
        return fn.potentialParents;
      }
    }

    function getBreadthLevel(draggedNodePos, potentialParentNode, 
      parentMeta) {
      // What paramaters I need?
      // How to do it?
      // If the parent didn't change
      // Detect the Y position relative to the parent

      // How to detect then the breadth level?
      // Know the total number of children
      let totalChildren = parentMeta.childrenIds.length;
      console.log("total " + totalChildren);
      if (totalChildren == 1) {
        return 0;
      } else {
        let pPos = potentialParentNode.plane.position;
        let totalLocalSpanY = (totalChildren - 1) * NodeManager.Y_UNIT;
        // How to get the position value?
        let startingPosY = pPos.y + (totalLocalSpanY * 0.5);
        
        let index = (draggedNodePos.y - pPos.y);
        index = Math.floor(index / NodeManager.Y_UNIT);
        return index;
      }
    }
  }

  

  exit() {

  }
}