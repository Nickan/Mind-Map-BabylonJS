



class DataManager {
  constructor() {
    this.clear();
  }

  clear() {
    this.dataContainer = new DataContainer();
    this.dataLoader = new DataLoader();

    // Temporary
    let dc = this.dataContainer;
    this.dataLoader.activeMeta = dc.activeMeta;

    this.prevDataCont;
  }

  onLoadData(cbFunc) {
    let dataLoader = new DataLoader();
    let container = dataLoader.loadDataContainer(loadData);

    function loadData(container) {
      let rein = new ReingoldTilford();
      let a = container.nodes;
      let dCont = rein.getCoordinates(a.get(1), container);
      cbFunc(dCont);
    }
  }

  revertBack() {
    if (this.prevDataCont == undefined)
      return false;
    this.dataContainer = this.prevDataCont;
    this.prevDataCont = undefined;
    return true;
  }

  embedCoordinates() {
    let dc = this.dataContainer;
    dc.resetCoordinates(dc.nodes.get(1));
    let rein = new ReingoldTilford();
    let coords = rein.getCoordinates(dc.nodes.get(1), dc);
    return coords;
  }

  addNewData(text, parentId, savePrevious = true) {
    if (savePrevious)
      this.prevDataCont = _.cloneDeep(this.dataContainer, true);

    let nodes = this.dataContainer.nodes;
    let metas = this.dataContainer.metas;

    let id = this.getHighestId(nodes) + 1;
    let node = {"text": text, "id": id};

    let meta = metas.get(id);
    if (meta == undefined) {
      meta = new Meta(id, parentId);
      metas.set(id, meta);
    }

    if (parentId != undefined) {
      let parentMeta = metas.get(parentId);
      if (parentMeta != undefined) {
        parentMeta.childrenIds.push(id);
      }
    }
    
    nodes.set(id, node);
    return node;
  }

  // !NOTE: Will have a profound effect when referencing is implemented
  deleteNode(nodeId) {
    let metas = _.cloneDeep(this.dataContainer.metas);
    metas = this.dataContainer.removeFromParentList(nodeId, metas);
    metas = deleteMeta(nodeId, metas);
    this.dataContainer.metas = metas;
    console.log(this.dataContainer.metas);

    function deleteMeta(nodeId, metas) {
      let meta = metas.get(nodeId);
      metas.delete(nodeId);
      return deleteChildren(metas, meta.childrenIds, 0);
    }

    function deleteChildren(metas, children, index) {
      if (children != undefined && index < children.length) {
        let nMeta = deleteMeta(children[index], metas);
        return deleteChildren(nMeta, children, index + 1);
      }
      return metas;
    }
  }

  getHighestId(nodes) {
    let highestValue = 0;
    nodes.forEach((value, index) => {
      if (highestValue < index) {
        highestValue = index;
      }
    });

    return  highestValue;
  }

  getParentId(nodeId) {
    return this.dataContainer.getParent(nodeId).id;
  }

  save() {
    this.dataLoader.save(this.dataContainer);
  }

  open(fn) {
    this.dataLoader.loadDataContainer((dc) => {
      this.dataContainer = dc;
      fn();
    });
  }

  getDescendants(nodeId) {
    let metas = this.dataContainer.metas;
    let d = getDescendantsRecursive(metas, nodeId, []);
    return d;

    function getDescendantsRecursive(metas, nodeId, currentList) {
      let childrenIds = metas.get(nodeId).childrenIds;
      if (childrenIds.length > 0) {
        currentList = currentList.concat(childrenIds);
        childrenIds.forEach((id) => {
          currentList = getDescendantsRecursive(metas, id, currentList);
        });
      }
      return currentList;
    }
  }

  changeParent(nodeId, parentId) {
    this.dataContainer.changeParent(nodeId, parentId);
  }
  
}