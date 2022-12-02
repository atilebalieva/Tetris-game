function log(func) {
  console.log(func);
}

function pa(arr, str) {
  if (str != undefined) console.log(str + ": ");

  for (let i = 0; i < arr.length; i++) {
    let s = "";
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === "" || arr[i][j] === " ") {
        s += "_ ";
      } else {
        s += arr[i][j] + " ";
      }
    }
    console.log(s);
  }
}

const playArea = document.getElementById("play-area");
const defaultColor = "rgb(25, 25, 65)";
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const nextBlock = document.getElementById("next-figure");
let pause = false;

let currentShape = null;
let currentPosition = 1;

let currentRow = 0;
let currentColumn = 4;

let timerInterval = null;
let paused = false;

let color = null;

function random_bg_color() {
  let x = Math.floor(Math.random() * 256);
  let y = Math.floor(Math.random() * 256);
  let z = Math.floor(Math.random() * 256);
  return "rgb(" + x + "," + y + "," + z + ")";
}

const allShapes = {
  L: {
    1: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    2: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    3: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    4: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  Z: {
    1: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    2: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
  },
  I: {
    1: [[1], [1], [1], [1]],
    2: [[1, 1, 1, 1]],
  },
  O: {
    1: [
      [1, 1],
      [1, 1],
    ],
  },
  T: {
    1: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    2: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    3: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    4: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
  },
  S: {
    1: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    2: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  },
};

////////////////////// Create cells on the page/////////////////////////////////////////
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

const modelArrayNextShape = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

function setCurrentShape() {
  let getKeysInAllShapes = Object.keys(allShapes);
  let randomKeys =
    getKeysInAllShapes[
      Math.floor(Math.random() * Object.keys(allShapes).length)
    ];
  currentShape = allShapes[randomKeys];
}

function createNewDivCell() {
  let newDiv = document.createElement("div");
  newDiv.classList.add("cellStyle");
  return playArea.appendChild(newDiv);
}

const divArray = new Array(20);

function createDivArray() {
  for (let i = 0; i < divArray.length; i++) {
    divArray[i] = Array.from({ length: 10 }).map(function (el) {
      el = createNewDivCell();
      return el;
    });
  }
}
createDivArray();

const nextShapeArr = new Array(6);

function createNewDivCellNextShape() {
  let newDiv = document.createElement("div");
  newDiv.classList.add("nextCellStyle");
  return nextBlock.appendChild(newDiv);
}

function createArrayNextShape() {
  for (let i = 0; i < nextShapeArr.length; i++) {
    nextShapeArr[i] = Array.from({ length: 8 }).map(function (el) {
      el = createNewDivCellNextShape();
      return el;
    });
  }
}
createArrayNextShape();

///////////////////////////////////////////////////////////////////////////

pauseButton.addEventListener("click", () => (pause = !pause));

function refreshDivArray(array, arrayDiv) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === "" || array[i][j] === 0) {
        arrayDiv[i][j].style.background = defaultColor;
      } else if (color === defaultColor) {
        color = "green";
        arrayDiv[i][j].style.background = color;
      } else if (array[i][j] === "+") {
        arrayDiv[i][j].style.background = "rgb(164, 35, 123)";
      } else {
        arrayDiv[i][j].style.background = color;
      }
    }
  }
}

function cleanArray(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] !== "+") {
        array[i][j] = "";
      }
    }
  }
}

function displayInNextBlock(currentShape) {
  log(currentShape);
  cleanArray(modelArrayNextShape);

  const shape = currentShape[1];

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] == "1") {
        modelArrayNextShape[1 + i][3 + j] = 1;
      }
    }
  }
  refreshDivArray(modelArrayNextShape, nextShapeArr);
  return modelArrayNextShape;
}

function copyCurrentShapeToModelArray() {
  cleanArray(modelArray);

  const shape = currentShape[currentPosition];

  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length;

  if (widthOfTheShape + currentColumn > 10) {
    currentColumn = 10 - widthOfTheShape;
  }

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        modelArray[currentRow + i][currentColumn + j] = shape[i][j];
      }
    }
  }
  refreshDivArray(modelArray, divArray);
}

window.addEventListener("keydown", (e) => {
  if (paused) {
    return;
  }
  handleKeyDown(e);
});

function handleKeyDown(e) {
  if (e.code === "ArrowLeft") {
    moveLeft();
  }
  if (e.code === "ArrowRight") {
    moveRight();
  }
  if (e.code === "ArrowUp") {
    handleArrowUp();
  }
  if (e.code === "ArrowDown") {
    moveDown();
  }
}

function moveLeft() {
  if (canMoveLeft()) {
    currentColumn--;
    copyCurrentShapeToModelArray();
  }
}

function canMoveLeft() {
  const shape = currentShape[currentPosition];
  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length;

  if (currentColumn === 0 || currentRow < 0) {
    return false;
  }

  for (let i = 0; i < heightOfTheShape; i++) {
    for (let j = 0; j < widthOfTheShape; j++) {
      if (
        shape[i][j] == 1 &&
        modelArray[currentRow + i][currentColumn + j - 1] == "+"
      ) {
        return false;
      }
    }
  }
  return true;
}

function moveRight() {
  if (canMoveRight()) {
    currentColumn++;
    copyCurrentShapeToModelArray();
  }
}

function canMoveRight() {
  const shape = currentShape[currentPosition];
  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length;

  if (currentColumn + widthOfTheShape > 10) {
    return false;
  }

  for (let i = 0; i < heightOfTheShape; i++) {
    for (let j = 0; j < widthOfTheShape; j++) {
      if (
        shape[i][j] == 1 &&
        modelArray[currentRow + i][currentColumn + j + 1] == "+"
      ) {
        return false;
      }
    }
  }
  return true;
}

function handleArrowUp() {
  const positionCount = Object.keys(currentShape).length; //4

  currentPosition++;

  if (currentPosition > positionCount) {
    currentPosition = 1;
  }

  copyCurrentShapeToModelArray();
}
let score = 0;
let level = 1;

function moveDown() {
  if (pause) {
    return;
  }

  if (canMoveDown()) {
    currentRow++;
    copyCurrentShapeToModelArray();
  } else {
    safePositionOfShape();
    for (let i = 0; i < modelArray.length; i++) {
      let count = 0;
      for (let j = 0; j < modelArray[i].length; j++) {
        if (modelArray[i][j] === "+") {
          count++;
        }
      }
      if (count === 10) {
        modelArray.splice(i, 1);
        modelArray.unshift(["", "", "", "", "", "", "", "", "", ""]);
      }
    }
    setCurrentShape();
    displayInNextBlock(currentShape);

    currentRow = 0;
    currentColumn = 4;
    currentPosition = 1;
  }
}

function canMoveDown() {
  const shape = currentShape[currentPosition];
  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length;

  if (currentRow + heightOfTheShape > 19) {
    return false;
  }

  for (let i = 0; i < heightOfTheShape; i++) {
    for (let j = 0; j < widthOfTheShape; j++) {
      if (
        shape[i][j] == 1 &&
        modelArray[currentRow + i + 1][currentColumn + j] == "+"
      ) {
        return false;
      }
    }
  }
  return true;
}

function safePositionOfShape() {
  for (let i = 0; i < modelArray.length; i++) {
    for (let j = 0; j < modelArray[i].length; j++) {
      if (modelArray[i][j] == 1) {
        modelArray[i][j] = "+";
      }
    }
  }
}

function newShape() {
  color = random_bg_color();
  setCurrentShape();
}

function handleTimer() {
  if (timerInterval === null) {
    timerInterval = setInterval(moveDown, 1000);
  }
}

function newShapeOnThePlayArea() {
  newShape();
  copyCurrentShapeToModelArray();
}

newShape();

playButton.addEventListener("click", () => {
  copyCurrentShapeToModelArray();
  handleTimer();

  newShape();
  displayInNextBlock(currentShape);
});
