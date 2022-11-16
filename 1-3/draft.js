function log(func) {
  console.log(func);
}

const playArea = document.getElementById("play-area");
const defaultColor = "rgb(25, 25, 65)";
function createNewDivCell() {
  let newDiv = document.createElement("div");
  newDiv.classList.add("cellStyle");
  return playArea.appendChild(newDiv);
}

const divArray = new Array(20); //20 rows

for (let i = 0; i < divArray.length; i++) {
  divArray[i] = Array.from({ length: 10 }).map(function (el) {
    el = createNewDivCell();
    return el;
  });
}

const modelArray = [
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
];

const allShapes = {
  j: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  l: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  i: [[1, 1, 1, 1]],
  o: [
    [1, 1],
    [1, 1],
  ],
  t: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  s: [
    [0, 1, 1],
    [1, 1, 0],
  ],
};

function currentShape() {
  let getKeysInAllShapes = Object.keys(allShapes);
  let randomKeys =
    getKeysInAllShapes[Math.floor(Math.random() * getKeysInAllShapes.length)];
  return allShapes[randomKeys];
}

function copyCurrentShapeToModelArray(currentShape) {
  let randomRow = Math.floor(Math.random() * 16);
  let randomColumn = Math.floor(Math.random() * 6);
  for (let i = 0; i < currentShape.length; i++) {
    for (let j = 0; j < currentShape[i].length; j++) {
      modelArray[randomRow + i][randomColumn + j] = currentShape[i][j];
    }
  }
}

function random_bg_color() {
  let x = Math.floor(Math.random() * 256);
  let y = Math.floor(Math.random() * 256);
  let z = Math.floor(Math.random() * 256);
  return (bgColor = "rgb(" + x + "," + y + "," + z + ")");
}

function refreshDivArray() {
  let color = random_bg_color();

  for (let i = 0; i < modelArray.length; i++) {
    for (let j = 0; j < modelArray[i].length; j++) {
      if (modelArray[i][j] == "" || modelArray[i][j] == 0) {
        divArray[i][j].style.background = defaultColor;
      } else if (color == defaultColor) {
        color = "green";
        divArray[i][j].style.background = color;
      } else {
        divArray[i][j].style.background = color;
      }
    }
  }
}
