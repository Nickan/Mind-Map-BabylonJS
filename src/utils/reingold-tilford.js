class ReingoldTilford {

  static get BREADTH_DIST() {
    return 1;
  }

  constructor() {

  }

  getCoordinates(startingNode, allNodes) {
    if (startingNode == undefined) {
      throw("startingNode should not be undefined");
    }

    let allNodesY = this.assignValueY(0, startingNode, allNodes);
    let ft = this.setInitialX(startingNode, allNodesY);
    
    return ft;
  }

  assignValueY(currentY, node, allNodes) {
    node.y = currentY;
    let children = this.getChildren(node, allNodes);

    children.forEach((child) => {
      this.assignValueY(currentY + 1, child, allNodes);
    });

    return allNodes;
  }

  setInitialX(node, allNodes) {
    this.setInitialXRelativeToChildren(node, allNodes);
    this.solveConflictingX(node, allNodes);
    return allNodes;
  }

  setInitialXRelativeToChildren(node, allNodes) {
    // let inX = _.cloneDeep(allNodes, true);

    let children = this.getChildren(node, allNodes);
    children.forEach((child) => {
      this.setInitialX(child, allNodes);
    });
    
    this.setLeafInitialX(node, allNodes); // Have to make it pure function later
    this.setParentWithChildInitialX(children, node, allNodes);
    this.setParentWithChildrenInitialX(children, node, allNodes);

    return allNodes;
  }

  solveConflictingX(node, allNodes) {
    // if (!this.leftMost(node) && node.childrenId.length > 0) {
    //   self.fixConflictingX(node, allNodes);
    // }
  }

  fixConflictingX(node, allNodes) {
    // let leftContour = this.getLeftContour(node, allNodes, 0);
  }


  getLeftContour(node, allNodes) {
    let contour = {};
    x = node.x;
    y = node.y;
  }



  setLeafInitialX(node, allNodes) {
    if (!this.isLeafNode(node)) {
      return; 
    }

    if (this.isLeftMost(node, allNodes)) {
      node.x = 0.0;
    } else {
      let leftSibling = this.getLeftSibling(node, allNodes);
      node.x = leftSibling.x + ReingoldTilford.BREADTH_DIST;
    }
  }

  setParentWithChildInitialX(children, node, allNodes) {
    if (children.length != 1) {
      return;
    }

    if (this.isLeftMost(node, allNodes)) {
      node.x = children[0].x;
    } else {
      let leftSibling = this.getLeftSibling(node, allNodes);
      node.x = leftSibling.x + ReingoldTilford.BREADTH_DIST;

      let firstChild = this.getChildren(node, allNodes)[0];
      node.mod = node.x - firstChild.x;
    }
  }

  setParentWithChildrenInitialX(children, node, allNodes) {
    if (children.length <= 1) {
      return;
    }

    let midX = this.getMidX(children);
    if (this.isLeftMost(node, allNodes)) {
      node.x = midX;
    } else {
      let leftSibling = this.getLeftSibling(node, allNodes);
      node.x = leftSibling.x + ReingoldTilford.BREADTH_DIST;
      node.mod = node.x - midX;
    }
  }


  getMidX(children) {
    let leftMost = children[0];
    let rightMost = children[children.length - 1];
    let leftX = leftMost.x;
    let rightX = rightMost.x;
    return (leftX + rightX) / 2.0;
  }



  getLeftSibling(node, allNodes) {
    let siblings = this.getSiblings(node, allNodes);

    let leftSiblingIndex = siblings.findIndex((ele) => {
      return ele.id == node.id;
    }) - 1;
    return siblings[leftSiblingIndex];
  }


  isLeafNode(node) {
    return node.childrenId.length == 0;
  }

  isLeftMost(node, allNodes) {
    if (this.isMainNode(node)) {
      return true;
    }

    let siblings = this.getSiblings(node, allNodes);
    if (siblings.length == 0) {
      return true;
    }
    return (siblings[0].id == node.id);
  }

  
  isMainNode(node) {
    return node.parentId == -1;
  }


  getChildren(node, allNodes) {
    let childrenId = node.childrenId;
    let children = new Array();
    childrenId.forEach((childId) => {
      let child = allNodes.get(childId);
      children.push(child);
    });
    return children;
  }

  getSiblings(node, allNodes) {
    let parent = allNodes.get(node.parentId);
    return this.getChildren(parent, allNodes);
  }
}