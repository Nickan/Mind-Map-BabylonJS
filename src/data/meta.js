class Meta {
  constructor(id, parentId, childrenIds = new Array()) {
    this.id = id;
    this.parentId = parentId;
    this.childrenIds = childrenIds;
  }
}