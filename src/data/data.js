class Data {
  
  constructor(id, text, parentId = 0, childrenId = new Array()) {
    this.id = id;
    this.text =text;
    this.parentId = parentId;
    this.childrenId = childrenId;
  }
}