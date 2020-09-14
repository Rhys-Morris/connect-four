// HTML Elements
const status = document.querySelector(".status");
const topCells = document.querySelectorAll(".cell.row-top");
const allCells = document.querySelectorAll(".cell:not(.row-top)");
const reset = document.querySelector(".reset");

//Rows
const topRow = Array.from(topCells);
const row0 = Array.from(document.querySelectorAll(".row-0"));
const row1 = Array.from(document.querySelectorAll(".row-1"));
const row2 = Array.from(document.querySelectorAll(".row-2"));
const row3 = Array.from(document.querySelectorAll(".row-3"));
const row4 = Array.from(document.querySelectorAll(".row-4"));
const row5 = Array.from(document.querySelectorAll(".row-5"));
const rows = [row0, row1, row2, row3, row4, row5, topRow];

//Columns
const column0 = Array.from(document.querySelectorAll(".col-0")).reverse();
const column1 = Array.from(document.querySelectorAll(".col-1")).reverse();
const column2 = Array.from(document.querySelectorAll(".col-2")).reverse();
const column3 = Array.from(document.querySelectorAll(".col-3")).reverse();
const column4 = Array.from(document.querySelectorAll(".col-4")).reverse();
const column5 = Array.from(document.querySelectorAll(".col-5")).reverse();
const column6 = Array.from(document.querySelectorAll(".col-6")).reverse();
const columns = [column0, column1, column2, column3, column4, column5, column6]


// Game Variables
let gameIsLive = true;
let yellowIsNext = true;
let moveCount = 0;

// ----- FUNCTIONS -----

// Update Status 
const updateStatus = () => {
    if (yellowIsNext) {
        status.textContent = "Yellow is next!";
        status.classList.toggle("yellow-border");
        status.classList.toggle("red-border");
    } else if (!yellowIsNext) {
        status.textContent = "Red is next!";
        status.classList.toggle("red-border");
        status.classList.toggle("yellow-border");
    }
}

// Diagonal win helper functions
const findStartPositionRight = (cell) => {
    let column = getClassList(cell)[2][4];
    let row = getClassList(cell)[1][4];

    while (row <= 5 && column >= 0) {
        if (row == 5) { break }
        if (column == 0) { break }
        column--;
        row++;
    }
    return rows[row][column];
};

const findStartPositionLeft = (cell) => {
    let column = getClassList(cell)[2][4];
    let row = getClassList(cell)[1][4];

    while (row <= 5 && column <= 6) {
        if (row == 5) { break }
        if (column == 6) { break }
        column++;
        row++;
    }
    return rows[row][column];
};


// Get Cell Color
const getCellColor = (cell) => {
    if (cell.classList.contains("red")) { return "red" }
    if (cell.classList.contains("yellow")) { return "yellow" }
    return null;
};

const getClassList = (cell) => {
    return Array.from(cell.classList);

};

// Title Case 
const titleCase = (string) => {
    let title = string.split("");
    title[0] = title[0].toUpperCase();
    title = title.join("");
    return title;
};

// Check Winner

const checkWinner = (cell) => {
    let checkColor = getCellColor(cell);
    let count = 0, matches = 0;
    let winningCells = [cell];

    // Check row win 
    let cellRow = getClassList(cell)[1][4];
    let rowToCheck = rows[cellRow];

    while (count < rowToCheck.length) {

        let currentCell = rowToCheck[count];
        let currentColor = getCellColor(currentCell);

        if (currentColor != checkColor) {
            count++;
            matches = 0;
            winningCells = [cell];
            continue
        } else {
            matches++;
            count++;
            winningCells.push(currentCell)
        }
        if (matches == 4) { handleWin(checkColor, winningCells) }
    }

    // Check column win
    let cellColumn = getClassList(cell)[2][4];
    let columnToCheck = columns[cellColumn];
    count = 0;
    matches = 0;
    
    console.log(cell); // TESTING
    console.log(winningCells)

    while (count < columnToCheck.length -1) {
        
        let currentCell = columnToCheck[count];
        let currentColor = getCellColor(currentCell);

        if (currentColor != checkColor) {
            winningCells = [cell];
            count++;
            matches = 0;
            continue
        } else {
            if (!winningCells.includes(currentCell)) {
                winningCells.push(currentCell)
            }
            matches++;
            count++;
        }

        console.log(matches);
        console.log(winningCells);

        if (matches == 4) { handleWin(checkColor, winningCells) }
    }

    // Check diagonal win /

    let currentCell = findStartPositionRight(cell);
    let currentRow = getClassList(currentCell)[1][4];
    let currentCol = getClassList(currentCell)[2][4];
    matches = 0;
    cellsToCheck = [currentCell];

    while (currentCol < 6 && currentRow > 0) {
        currentRow--;
        currentCol++;
        cellsToCheck.push(rows[currentRow][currentCol]);
    }

    for (let checkCell of cellsToCheck) {
        let currentCol = getCellColor(checkCell);
        if (currentCol == checkColor) {
            matches++;
            winningCells.push(checkCell);
        } else {
            matches = 0;
            winningCells = [cell];
        }
        if (matches == 4) { handleWin(checkColor, winningCells) }
    }

    // Check diagonal win \

    currentCell = findStartPositionLeft(cell);
    currentRow = getClassList(currentCell)[1][4];
    currentCol = getClassList(currentCell)[2][4];
    matches = 0;
    cellsToCheck = [currentCell];

    while (currentCol > 0 && currentRow > 0) {
        currentRow--;
        currentCol--;
        cellsToCheck.push(rows[currentRow][currentCol]);
    }

    for (let checkCell of cellsToCheck) {
        let currentCol = getCellColor(checkCell);
        if (currentCol == checkColor) {
            matches++;
            winningCells.push(checkCell);
        } else {
            matches = 0;
            winningCells = [cell];
        }
        if (matches == 4) { handleWin(checkColor, winningCells) }
    }

};

// Handle win 

const handleWin = (color, winningCells) => {
    color = titleCase(color);
    status.textContent = `${color} wins!`;
    if (color == "yellow") {
        status.classList.remove("red-border");
        status.classList.add("yellow-border");
    } else if (color == "red") {
        status.classList.add("red-border");
        status.classList.remove("yellow-border");
    }
    gameIsLive = false;
    for (let cell of winningCells) {
        cell.classList.add("win");
    }
    for (let cell of topRow) {
        cell.classList.remove("yellow");
        cell.classList.remove("red");
    }
}

// Handle tie

const handleTie = () => {
    status.textContent = `Game is a tie!`;
    status.classList.toggle("black-border");
    status.classList.toggle("red-border");
    status.classList.toggle("yellow-border");
    gameIsLive = false;
    for (let cell of topRow) {
        cell.classList.remove("yellow");
        cell.classList.remove("red");
    }
}


// ----- EVENT HANDLING -----

// Hover marker placement
for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
        rows[i][j].addEventListener('mouseover', (e) => {
            if (!gameIsLive) { return }
            yellowIsNext ? topRow[j].classList.add("yellow") : topRow[j].classList.add("red");
        });
        rows[i][j].addEventListener('mouseout', (e) => {
            topRow[j].classList.remove("yellow");
            topRow[j].classList.remove("red");
        });
    }
}

// Place next marker

for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns[i].length; j++) {
        columns[i][j].addEventListener('click', (e) => {
            if (!gameIsLive) { return }
            let count = 0;
            for (let cell of columns[i]) {
                if (count == 6) { return }
                if (!cell.classList.contains("red") && !cell.classList.contains("yellow")) {
                    yellowIsNext ? cell.classList.add("yellow") : cell.classList.add("red");
                    checkWinner(cell);
                    if (!gameIsLive) { return }
                    break;
                }
                count++;
            }
            yellowIsNext = !yellowIsNext;
            updateStatus();
            moveCount++;
            if (moveCount === 42) {
                handleTie()
                return
            }
            columns[i][6].classList.toggle("yellow");
            columns[i][6].classList.toggle("red");
        });
    }
}

// Reset button clicked

reset.addEventListener('click', (e) => {
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].length; j++) {
            rows[i][j].classList.remove("red");
            rows[i][j].classList.remove("yellow");
            rows[i][j].classList.remove("win");
        }
    }
    winningCells = [];
    yellowIsNext;    
    status.classList.remove("black-border");
    status.classList.remove("red-border");
    status.classList.add("yellow-border");
    status.textContent = "Yellow is next!";
    moveCount = 0;
    gameIsLive = true;
});