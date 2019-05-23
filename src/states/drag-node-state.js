


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

    this.excludedNodeIds = elon.dataManager.getDescendants(this.data.nodeId);
    this.excludedNodeIds.push(this.data.nodeId);


    this.controls = new DragNodeControls(elon.scene, this.data);
    this.controls.dragStopCb = () => {
      elon.scene.onPointerUp = undefined;
      elon.dataManager.changeParent(this.data.nodeId, this.newPotentialParentId);
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
    let pId = getNewPotentialParent(ng, nodesG, this.excludedNodeIds);
    // console.log(pId);
    this.newPotentialParentId = pId;


    function getNewPotentialParent(draggedNodeGraphic, nodeGraphics, excludedNodeIds) {
      return getFirstCollisionId(draggedNodeGraphic, nodeGraphics, excludedNodeIds);

      function getFirstCollisionId(draggedNodeGraphic, nodeGraphics, excludedNodeIds) {
        for (let [nodeId, nodeG] of nodeGraphics) {
          if (!excludedNodeIds.includes(nodeId)) {
            if (draggedNodeGraphic.plane.intersectsMesh(nodeG.obb)) {
              return nodeId;
            }
          }
        }

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
      // console.log("total " + totalChildren);
      if (totalChildren == 1) {
        return 0;
      } else {
        let pPos = potentialParentNode.plane.position;

        let startingPoint = getStartingPoint(pPos, totalChildren);
        
        let posIndex = (draggedNodePos.y - startingPoint);
        // console.log("posIndex " + startingPoint);
        let breadthLevel = Math.floor(posIndex / (totalChildren - 1));
        return breadthLevel;
        // let totalLocalSpanY = (totalChildren - 1) * NodeManager.Y_UNIT;
        // // How to get the position value?
        // let startingPosY = pPos.y + (totalLocalSpanY * 0.5);
        
        // let index = (draggedNodePos.y - pPos.y);
        // index = Math.floor(index / NodeManager.Y_UNIT);
        // return index;
      }

      function getStartingPoint(parentPos, totalChildren) {
        let startPointDiff = (NodeManager.Y_UNIT * (totalChildren - 1));
        return (parentPos.y - (startPointDiff * 0.5));
      }
    }
  }

  

  exit() {

  }
}