


class DataLoader {
  static ACTIVE_META = "activeMeta";
  static META = "meta-";  // Used for indicating the meta view name
  constructor() {

  }

  loadDataContainer(cbFunc) {
    getAsText((resultStr) => {
      let allData = getMap(resultStr);
      let result = separateNodesAndMetaMap(allData);

      this.activeMeta = result[0].get(DataLoader.ACTIVE_META);
      result[0].delete(DataLoader.ACTIVE_META);
      let nodes = convertKeyToInt(result[0]);

      let metaMap = result[1];
      let metas = metaMap.get(this.activeMeta);

      let c = new DataContainer(nodes, metas);
      cbFunc(c);
    });

    function getAsText(fn) {
      // let input = document.querySelector('input');
      var input = document.createElement('input');
      input.setAttribute("id", "inputFile");
      input.setAttribute("type", "file");
      var b = document.querySelector('body');
      b.append(input); 
      input.click();
      input.onchange = function (event) {
        let file = input.files[0];
        let fr = new FileReader();
        fr.onload = function (event) {
          fn(fr.result);
        }
        fr.readAsText(file);
        event.preventDefault();
        input.remove();
      }
    }

    function getMap(str) {
      let map = undefined;
      try {
        let obj = JSON.parse(str);
        map = new Map(Object.entries(obj));
      } catch (e) {
        console.log(e);
      }
      return map;
    }

    function separateNodesAndMetaMap(map) {
      // How to remove the list in the map at the same time?
      let nMap = _.cloneDeep(map);
      let metaMap = new Map();
      nMap.forEach((value, index) => {
        if (typeof index == "string") {
          if (index.includes(DataLoader.META)) {
            let mMap = new Map(Object.entries(value));
            metaMap.set(index, convertKeyToInt(mMap));
            nMap.delete(index);
          }
        }

      });
      return [nMap, metaMap];
    }

    function convertKeyToInt(map) {
      let m = new Map();
      map.forEach((value, index) => {
        m.set(parseInt(index), value);
      });
      return m;
    }

  }




  save(dataContainer, mapName = "Plans") {
    let metaMap = dataContainer.metaMap;
    metaMap.set(this.activeMeta, dataContainer.defaultMetas);
    let nodes = _.cloneDeep(dataContainer.defaultNodes);
    nodes.set(DataLoader.ACTIVE_META, this.activeMeta);

    metaMap.forEach((value, index) => {
      nodes.set(index, value);
    });

    let merged = convertMapToStr(nodes);
    download(merged, mapName + ".json", "text.json");

    function convertMapToStr(map) {
      let obj = {};
      map.forEach((value, index) => {
        if (value.x != undefined)
          value.x = undefined;
        if (value.y != undefined)
          value.y = undefined;
        if (value.mod != undefined)
          value.mod = undefined;

        if (value instanceof Map) {
          let str = convertMapToObj(value);
          obj[index] = str;
        } else {
          obj[index] = value;
        }
      });

      return JSON.stringify(obj);
    }

    function convertMapToObj(map) {
      let obj = {};
      map.forEach((value, index) => {
        obj[index] = value;
      });
      return obj;
    }

    function download(content, fileName, contentType) {
      let a = document.createElement("a");
      let file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
  }


}