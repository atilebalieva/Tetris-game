console.log('TEST');

function log(func) {
  console.log(func);
}

const playArea = document.getElementById("play-area");
const defaultColor = "rgb(25, 25, 65)";
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const nextBlock = document.getElementById("next-figure");

let pause = false;

let currentShape = null;
let currentPosition = 1;

let changeRowPosition = 0;
let changeColumnPosition = 4;

const divArray = new Array(20);

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
    1: [[1, 1, 1, 1]],
    2: [[1], [1], [1], [1]],
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

function createNewDivCell() {
  let newDiv = document.createElement("div");
  newDiv.classList.add("cellStyle");
  return playArea.appendChild(newDiv);
}

for (let i = 0; i < divArray.length; i++) {
  divArray[i] = Array.from({ length: 10 }).map(function (el) {
    el = createNewDivCell();
    return el;
  });
}

const nextDivArr = new Array(4);

function createNewDivCellNextBlock() {
  let newDiv = document.createElement("div");
  newDiv.classList.add("nextCellStyle");
  return nextBlock.appendChild(newDiv);
}

for (let i = 0; i < nextDivArr.length; i++) {
  nextDivArr[i] = Array.from({ length: 4 }).map(function (el) {
    el = createNewDivCellNextBlock();
    return el;
  });
}

function refreshDivArray() {
  for (let i = 0; i < modelArray.length; i++) {
    for (let j = 0; j < modelArray[i].length; j++) {
      if (modelArray[i][j] === "" || modelArray[i][j] === 0) {
        divArray[i][j].style.background = defaultColor;
      } else if (color === defaultColor) {
        color = "green";
        divArray[i][j].style.background = color;
      } else if (modelArray[i][j] === "+") {
        divArray[i][j].style.background = "rgb(164, 35, 123)";
      } else {
        divArray[i][j].style.background = color;
      }
    }
  }
}

function cleanModelArray() {
  for (let i = 0; i < modelArray.length; i++) {
    for (let j = 0; j < modelArray[i].length; j++) {
      if (modelArray[i][j] === "+") {
        modelArray[i][j] = "+";
      }
      if (modelArray[i][j] === 1) {
        modelArray[i][j] = "";
      }
    }
  }
}

function random_bg_color() {
  let x = Math.floor(Math.random() * 256);
  let y = Math.floor(Math.random() * 256);
  let z = Math.floor(Math.random() * 256);
  return "rgb(" + x + "," + y + "," + z + ")";
}

let color = random_bg_color();

function setCurrentShape() {
  let getKeysInAllShapes = Object.keys(allShapes);
  let randomKeys =
    getKeysInAllShapes[Math.floor(Math.random() * getKeysInAllShapes.length)];
  currentShape = allShapes[randomKeys];
}

window.addEventListener("keydown", (e) => {
  if (pause) {
    return;
  }
  handleKeyDown(e);
});

function handleKeyDown(e) {
  if (e.code === "ArrowUp") {
    handleArrowUp();
    copyCurrentShapeToModelArray();
  }
  if (e.code === "ArrowDown") {
    handleArrowDown();
  }
  if (e.code === "ArrowLeft") {
    handleArrowLeft();
    copyCurrentShapeToModelArray();
  }
  if (e.code === "ArrowRight") {
    handleArrowRight();
    copyCurrentShapeToModelArray();
  }
}

function handleArrowUp() {
  const positionCount = Object.keys(currentShape).length;
  currentPosition++;

  if (currentPosition > positionCount) {
    currentPosition = 1;
  }
}

function handleArrowDown() {
  if (pause) {
    return;
  }

  const shape = currentShape[currentPosition];
  const heightOfTheShape = shape.length;

  if (changeRowPosition + heightOfTheShape < 20) {
    changeRowPosition++;
    copyCurrentShapeToModelArray();
  } else {
    safePositionOfShape(shape);
    changeRowPosition = 0;
    changeColumnPosition = 4;
    newShapeOnThePlayArea();
  }
}

function safePositionOfShape(shape) {
  for (let i = 0; i < modelArray.length; i++) {
    for (let j = 0; j < modelArray[i].length; j++) {
      if (modelArray[i][j] === 1) {
        modelArray[i][j] = "+";
        log(true);
      }
    }
  }
}

function handleArrowLeft() {
  if (changeColumnPosition > 0) {
    changeColumnPosition--;
  }
}

function handleArrowRight() {
  changeColumnPosition++;
}

function copyCurrentShapeToModelArray() {
  cleanModelArray();

  const shape = currentShape[currentPosition];
  const widthOfTheShape = shape[0].length;
  const heightOfTheShape = shape.length;

  if (changeColumnPosition + widthOfTheShape > 10) {
    changeColumnPosition = 10 - widthOfTheShape;
  }

  if (changeRowPosition + heightOfTheShape > 20) {
    changeRowPosition = 20 - heightOfTheShape;
  }

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      modelArray[changeRowPosition + i][changeColumnPosition + j] = shape[i][j];
    }
    refreshDivArray();
  }
}

playButton.addEventListener("click", () => {
  newShapeOnThePlayArea();
  handleTimer();
});

function newShapeOnThePlayArea() {
  setCurrentShape();
  copyCurrentShapeToModelArray();
}

pauseButton.addEventListener("click", () => (pause = !pause));

function handleTimer() {
  setInterval(() => {
    handleArrowDown();
  }, 1000);
}
