class DataContainer {

  constructor(nodes = new Map(), metas = new Map()) {
    this.nodes = nodes;
    this.metas = metas;
    this.metaMap = new Map();
    this.defaultNodes = _.cloneDeep(nodes);
    this.defaultMetas = _.cloneDeep(metas);

    // Temporary
    let tmpName = "View1";
    // this.metaMap.set(DataLoader.META + tmpName, metas);
    this.activeMeta = DataLoader.META + tmpName;
    this.metaMap.set(this.activeMeta, this.metas);
    this.nodes.set(DataLoader.ACTIVE_META, this.activeMeta);
  }

  getChildren(nodeId, nodeStateCheck = true) {
    let mData = this.metas.get(nodeId);

    if (nodeStateCheck) {
      if (mData.foldDescendants != undefined) {
        return [];
      }
    }
    

    let childrenIds = mData.childrenIds;
    let children = new Array();
    childrenIds.forEach((childId) => {
      let child = this.nodes.get(childId);
      children.push(child);
    });
    return children;
  }

  getSiblings(nodeId) {
    let mData = this.metas.get(nodeId);
    return this.getChildren(mData.parentId);
  }

  isLeftMost(nodeId) {
    if (this.isMainNode(nodeId)) {
      return true;
    }

    let siblings = this.getSiblings(nodeId);
    if (siblings.length == 0) {
      return true;
    }
    return (siblings[0].id == nodeId);
  }

  isMainNode(nodeId) {
    let meta = this.metas.get(nodeId);
    return meta.parentId == undefined;
  }

  hasChildren(nodeId, nodeStateCheck = true) {
    // return (this.metas.get(nodeId).childrenIds.length > 1);
    return (this.getChildren(nodeId, nodeStateCheck).length > 1);
  }

  isLeafNode(nodeId) {
    return !this.hasChildren(nodeId);
  }

  hasChild(nodeId, nodeStateCheck = true) {
    return (this.getChildren(nodeId, nodeStateCheck).length == 1);
  }

  getLeftSibling(nodeId) {
    let siblings = this.getSiblings(nodeId);

    let leftSiblingIndex = siblings.findIndex((ele) => {
      return ele.id == nodeId;
    }) - 1;
    return siblings[leftSiblingIndex];
  }

  getLeftMostSibling(nodeId) {
    let pId = this.metas.get(nodeId).parentId;
    if (pId == undefined) {
      throw("Can't get parent id of node id " + nodeId);
      return undefined;
    }

    let c = this.getChildren(pId);
    if (c.length == 0) {
      throw("No children, please check for error");
    }
    return c[0];
  }

  getRightSibling(nodeId) {
    let pId = this.metas.get(nodeId).parentId;
    let children = this.getChildren(pId);

    let data = this.nodes.get(nodeId);
    let rightSiblingIndex = children.indexOf(data) + 1;
    if (rightSiblingIndex < children.length) {
      return children[rightSiblingIndex];
    }
    return undefined;
  }

  getLeftCousin(nodeId) {
    let p = this.getParent(nodeId);
    return this.getLeftMostSibling(p.id);
  }

  getParent(nodeId) {
    let pId = this.metas.get(nodeId).parentId;
    return this.nodes.get(pId);
  }

  removeFromParentList(nodeId, metas) {
    let pId = metas.get(nodeId).parentId;
    if (pId != undefined) {
      let cIds = metas.get(pId).childrenIds;
      let index = cIds.indexOf(nodeId);
      if (index !== -1) {
        cIds.splice(index, 1);
        // this.metas.get(pId).childrenIds = cIds;
        metas.get(pId).childrenIds = cIds;
      }
    }
    return metas;
  }

  changeParent(nodeId, parentId) {
    this.removeFromParentList(nodeId, this.metas);
    let meta = this.metas.get(nodeId);
    meta.parentId = parentId;
    let pm = this.metas.get(parentId);
    pm.childrenIds.push(nodeId); // Have to be changed later
  }

  resetCoordinates(node) {
    node.x = undefined;
    node.y = undefined;
    node.mod = undefined;
    let children = this.getChildren(node.id);
    children.forEach((child) => {
      this.resetCoordinates(child);
    });
  }

}