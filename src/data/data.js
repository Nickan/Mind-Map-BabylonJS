class Data {
  
  constructor(id, text, parentId = 0, childrenIds = new Array()) {
    this.id = id;
    this.text =text;
    this.parentId = parentId;
    this.childrenIds = childrenIds;
  }
}