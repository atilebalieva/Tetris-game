function log(func) {
  console.log(func);
}

const playArea = document.getElementById("play-area");
const defaultColor = "rgb(25, 25, 65)";
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const mobilePlayBtn = document.getElementById("control-play-button");
const mobilePauseBtn = document.getElementById("control-pause-button");
const nextBlock = document.getElementById("next-figure");
let pause = false;

let currentShape = null;
let currentPosition = 1;

let currentRow = 0;
let currentColumn = 4;

let timerInterval = null;
let paused = false;

let color = null;
let nextShape = null;

let score = 0;
let level = 1;

function random_bg_color() {
  let x = Math.floor(Math.random() * 256);
  let y = Math.floor(Math.random() * 256);
  let z = Math.floor(Math.random() * 256);
  return "rgb(" + x + "," + y + "," + z + ")";
}

const allShapes = {
  L: {
    1: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    2: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    3: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    4: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  },
  L2: {
    1: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    2: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    3: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    4: [
      [0, 1],
      [0, 1],
      [1, 1],
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
      } else if (array[i][j] === "Shadow") {
        arrayDiv[i][j].style.background = "rgb(100, 93, 127)";
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

function displayInNextBlock() {
  cleanArray(modelArrayNextShape);

  const shape = nextShape[1];

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        modelArrayNextShape[1 + i][3 + j] = 1;
      }
    }
  }
  refreshDivArray(modelArrayNextShape, nextShapeArr);
  return modelArrayNextShape;
}

function doProjection() {
  let startRow = getProjectionRow();
  const shape = currentShape[currentPosition];
  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length;

  for (let i = 0; i < heightOfTheShape; i++) {
    for (let j = 0; j < widthOfTheShape; j++) {
      if (
        modelArray[startRow + i][currentColumn + j] === "" &&
        shape[i][j] === 1
      ) {
        modelArray[startRow + i][currentColumn + j] = "Shadow";
      }
    }
  }
}

function getProjectionRow() {
  for (let i = currentRow; i < modelArray.length; i++) {
    if (hasProjectionCollision(i)) {
      return i - 1;
    }
  }
  const shape = currentShape[currentPosition];
  const heightOfTheShape = shape.length;

  return modelArray.length - heightOfTheShape;
}

function hasProjectionCollision(row) {
  const shape = currentShape[currentPosition];
  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length; //4

  for (let i = 0; i < heightOfTheShape; i++) {
    for (let j = 0; j < widthOfTheShape; j++) {
      if (
        modelArray[row + i] === undefined ||
        (shape[i][j] === 1 && modelArray[row + i][currentColumn + j] === "+")
      ) {
        return true;
      }
    }
  }
  return false;
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
  doProjection();
  refreshDivArray(modelArray, divArray);
}

function gameOver() {
  const shape = currentShape[currentPosition];

  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length;

  for (let i = 0; i < heightOfTheShape; i++) {
    for (let j = 0; j < widthOfTheShape; j++) {
      if (modelArray[i][currentColumn + j] === "+" && shape[i][j] === 1) {
        clearInterval(timerInterval);
        document.getElementById("game-over").style.display = "block";
        document.getElementById("result-level").innerText = level;
        document.getElementById("result-score").innerText = score;
        return true;
      }
    }
  }
  return false;
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
    rotateShape();
  }
  if (e.code === "ArrowDown") {
    moveDown();
  }
}

function moveLeft() {
  if (pause) {
    return;
  }

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
        shape[i][j] === 1 &&
        modelArray[currentRow + i][currentColumn + j - 1] === "+"
      ) {
        return false;
      }
    }
  }
  return true;
}

function moveRight() {
  if (pause) {
    return;
  }

  if (canMoveRight()) {
    currentColumn++;
    copyCurrentShapeToModelArray();
  }
}

function canMoveRight() {
  const shape = currentShape[currentPosition];
  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length;

  if (currentColumn + widthOfTheShape > 10 || currentRow < 0) {
    return false;
  }

  for (let i = 0; i < heightOfTheShape; i++) {
    for (let j = 0; j < widthOfTheShape; j++) {
      if (
        shape[i][j] === 1 &&
        modelArray[currentRow + i][currentColumn + j + 1] === "+"
      ) {
        return false;
      }
    }
  }
  return true;
}

function rotateShape() {
  if (pause) {
    return;
  }
  const positionCount = Object.keys(currentShape).length;

  currentPosition++;

  if (currentPosition > positionCount || positionCount === 1) {
    currentPosition = 1;
  }

  copyCurrentShapeToModelArray();
}

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
        score++;
        document.getElementById("score").innerText = score;
        modelArray.splice(i, 1);
        modelArray.unshift(["", "", "", "", "", "", "", "", "", ""]);
      }
      if (score === 10) {
        score = 0;
        level++;
        document.getElementById("level").innerText = level;
      }
    }
    currentRow = -1;
    currentColumn = 4;
    currentPosition = 1;
    currentShape = nextShape;

    if (gameOver()) {
      return;
    }

    nextShape = getRandomShape();
    displayInNextBlock();

    refreshDivArray(modelArray, divArray);
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
        modelArray[currentRow + i + 1][currentColumn + j] === "+"
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

function getRandomShape() {
  color = random_bg_color();
  let getKeysInAllShapes = Object.keys(allShapes);
  let randomKeys =
    getKeysInAllShapes[
      Math.floor(Math.random() * Object.keys(allShapes).length)
    ];

  return allShapes[randomKeys];
}

function newShape() {
  nextShape = getRandomShape();
  currentShape = getRandomShape();
}

function handleTimer() {
  if (timerInterval === null) {
    timerInterval = setInterval(moveDown, 1000);
  }
}
newShape();
function newShapeOnThePlayArea() {
  handleTimer();
  displayInNextBlock();
}

playButton.addEventListener("click", newShapeOnThePlayArea);
mobilePlayBtn.addEventListener("click", newShapeOnThePlayArea);

pauseButton.addEventListener("click", () => (pause = !pause));
mobilePauseBtn.addEventListener("click", () => (pause = !pause));

const leftButton = document.getElementById("arrow-left");
const rightButton = document.getElementById("arrow-right");
const upButton = document.getElementById("arrow-up");
const downButton = document.getElementById("arrow-down");

leftButton.addEventListener("click", () => {
  moveLeft();
});
rightButton.addEventListener("click", () => {
  moveRight();
});
upButton.addEventListener("click", () => {
  rotateShape();
});
downButton.addEventListener("click", () => {
  moveDown();
});

function cleanPlayArea() {
  for (let i = 0; i < modelArray.length; i++) {
    for (let j = 0; j < modelArray[i].length; j++) {
      modelArray[i][j] = "";
      divArray[i][j].style.background = defaultColor;
    }
  }
}

function cleanNextShapeArea() {
  for (let i = 0; i < modelArrayNextShape.length; i++) {
    for (let j = 0; j < modelArrayNextShape[i].length; j++) {
      modelArrayNextShape[i][j] = "";
      nextShapeArr[i][j].style.background = defaultColor;
    }
  }
}

//homeWork for me:
// need to work with OK button
// document.getElementById("ok-button").addEventListener("click", () => {
//   cleanPlayArea();
//   cleanNextShapeArea();
//   document.getElementById("game-over").style.display = "none";
// });
