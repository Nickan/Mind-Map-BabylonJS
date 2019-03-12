class DataManager {
  constructor() {
    

    let allData = this.getAllData();
    console.log(allData);

    this.reingold = new ReingoldTilford();
    let coords = this.reingold.getCoordinates(allData.get(0), allData);
    console.log(coords);
  }

  // Should be coming from file or database
  // Doesn't necessarily need to be a json
  // Need to have sample data to be a unit test
  getAllData() {
    let allData = new Map();

    let data1 = new Data(0, "0", -1, new Array(1, 2, 3));
    let data2 = new Data(1, "1", 0);
    let data3 = new Data(2, "2", 0);
    let data4 = new Data(3, "3", 0);

    allData.set(0, data1);
    allData.set(1, data2);
    allData.set(2, data3);
    allData.set(3, data4);

    return allData;
  }

  
}