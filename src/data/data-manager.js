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

  embedCoordinates(startingId) {
    let dc = this.dataContainer;
    let startingNode = dc.nodes.get(startingId);
    dc.resetCoordinates(startingNode);
    let rein = new ReingoldTilford();
    let coords = rein.getCoordinates(startingNode, dc);
    return coords;
  }

  getVisibleMetas() {
    let dc = this.dataContainer;
    let m = _.cloneDeep(dc.defaultMetas);
    let mMeta = getMainMeta(m);
    let result = {
      deepestLevel: 0
    }

    result = getDeepestMetaFoldAncestors(m, mMeta, 1, result);
    
    if (result.metaId !== undefined) {
      mMeta = m.get(result.metaId);
    }

    let vm = getVisibleMetas(mMeta, m);
    let startingMeta = vm.get(mMeta.id);
    startingMeta.parentId = undefined;
    return [startingMeta.id, vm];
    
    //#region helpers
    function getMainMeta(metas) {
      let main = undefined;
      metas.forEach((meta) => {
        if (meta.parentId == undefined) {
          main = meta;
        }
      });
      return main;
    }

    function getDeepestMetaFoldAncestors(metas, currentMeta, depth, result) {
      let cIds = currentMeta.childrenIds;

      cIds.forEach((cmId) => {
        let cm = metas.get(cmId);
        if (cm.foldAncestors != undefined) {
          if (result.deepestLevel < depth) {
            result.deepestLevel = depth;
            result.metaId = cmId;
          }
        }
        getDeepestMetaFoldAncestors(metas, cm, depth + 1, result);
      });
      return result;
    }

    function getVisibleMetas(startingMeta, metas) {
      let visibleMetas = new Map();

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
    }
    //#endregion
  }

  getVisibleNodes(visibleMetas) {
    let vn = new Map();
    let nodes = _.cloneDeep(this.dataContainer.defaultNodes);
    visibleMetas.forEach((value, key) => {
      vn.set(key, nodes.get(key));
    });
    return vn;
  }

  addNewData(text, parentId, savePrevious = true) {
    if (savePrevious)
      this.prevDataCont = _.cloneDeep(this.dataContainer, true);

    let nodes = this.dataContainer.defaultNodes;
    let metas = this.dataContainer.defaultMetas;

    let id = this.getHighestId(nodes) + 1;
    let node = {"text": text, "id": id};

    let meta = metas.get(id);
    if (meta == undefined) {
      meta = {
        id: id,
        parentId: parentId,
        childrenIds: [],
      }
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
    let metas = _.cloneDeep(this.dataContainer.defaultMetas);
    metas = this.dataContainer.removeFromParentList(nodeId, metas);
    metas = deleteMeta(nodeId, metas);
    this.dataContainer.defaultMetas = metas;

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
    let parent = this.dataContainer.getParent(nodeId);
    if (parent == undefined) {
      return undefined
    }
    return parent.id;
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
    let metas = this.dataContainer.defaultMetas;
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

  toggleFoldDescendants(nodeId) {
    let m = this.dataContainer.defaultMetas.get(nodeId);

    if (m.foldDescendants == undefined) {
      m.foldDescendants = true;
    } else {
      m.foldDescendants = undefined;
    }
    
  }

  toggleFoldUnfoldAncestors(nodeId) {
    let ms = this.dataContainer.defaultMetas;
    let m = ms.get(nodeId);

    if (m.foldAncestors == undefined) {
      m.foldAncestors = true;
    } else {
      m.foldAncestors = undefined;
    }
  }

  getChildrenIds(nodeId) {
    return this.dataContainer.defaultMetas.get(nodeId).childrenIds;
  }

  changeSiblingIndex(nodeId, parentId, index) {
    let m = this.dataContainer.defaultMetas;
    let c = m.get(parentId).childrenIds;
    let nodeIndex = c.indexOf(nodeId);
    c.splice(nodeIndex, 1);
    c.splice(index, 0, nodeId);
  }

  editText(nodeId, text) {
    this.dataContainer.defaultNodes.get(nodeId).text = text;
  }
  
}