const prompt = require('prompt-sync')({sigint: true});

class Field { 
    constructor(grid) {
        this.grid = grid;       
        this.clearScreen();
    }
    print() {
        for (let row of this.grid) {
            console.log(row.join(''));
        };
    }

    clearScreen() {
        process.stdout.write("\u001b[2J\u001b[0;0H"); //clears the terminal screen
    }

    static randomPositionInArray(rows, cols) {       
        let outputArray = [];
        outputArray[0] = Math.floor(Math.random() * rows);
        outputArray[1] = Math.floor(Math.random() * cols);
        return outputArray;
    }
}

/****************************************************************/
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let position = [];
let rowCount = 0;
let colCount = 0;
let numOfHoles = 0;
let generatedField = [];

//Ask player for dimensions and holes
rowCount = prompt('How many rows do you want?');  
colCount = prompt('How many columns do you want?');
numOfHoles = prompt('How many holes do you want (as a percentage) 1-100?');    
//Create the field
generatedField = new Array(parseInt(rowCount)).fill(null).map(() => new Array(parseInt(colCount)).fill(fieldCharacter));
let hatPosition = Field.randomPositionInArray(parseInt(rowCount), parseInt(colCount));
let hatRow = hatPosition[0];
let hatCol = hatPosition[1];

// Ensure that the hat is not at the starting position (0,0)
while (hatRow === 0 && hatCol === 0) {
    hatPosition = Field.randomPositionInArray(parseInt(rowCount), parseInt(colCount));
    hatRow = hatPosition[0];
    hatCol = hatPosition[1];
}
// Set the location of the hat
generatedField[hatRow][hatCol] = hat;

//Set the holes
const totalCells = parseInt(rowCount) * parseInt(colCount);
const holesToCreate = Math.floor((parseInt(numOfHoles) / 100) * totalCells);

let holesCreated = 0;
while (holesCreated < holesToCreate) {
    let holePosition = Field.randomPositionInArray(parseInt(rowCount), parseInt(colCount));
    let holeRow = holePosition[0];
    let holeCol = holePosition[1];
    
    // Ensure that the hole is not at the starting position (0,0) or the hat position
    if ((holeRow !== 0 || holeCol !== 0) && (holeRow !== hatRow || holeCol !== hatCol) && generatedField[holeRow][holeCol] !== hole) {
        generatedField[holeRow][holeCol] = hole;
        holesCreated++;
    }
}




// Set the starting position to pathCharacter
generatedField[0][0] = pathCharacter;

// Store the starting position
position = [0 ,0];

const myField = new Field (generatedField);

myField.print();
console.log(`Number of holes created: ${holesCreated}`);
console.log(`You are the * in the top left corner of a ${colCount} x ${rowCount} grid. `)
let endGame = false;

while (!endGame) {
let userInput = prompt('Which way?');
//'U'p, 'D'own, 'L'eft and 'R'ight only
    switch (userInput) {
        case 'u':
            if(position[0]) { // >0? then valid to move up/
                position[0] -= 1;
            } else {
                console.log("You can't move up from the top row. Game over.")
                endGame = true;
            }                   
        break;

        case 'd':
            if(position[0] < rowCount - 1) { //< max nmber of rows? then move up
                position[0] += 1;
            } else {
                console.log("You can't move down from the last row. Game over.");
                endGame = true;
            }
        break;

        case 'l':
            if(position[1]) {
                position[1] -= 1;
            } else {
                console.log("You can't move left from the first column. Game over.")
                endGame = true;
            }            
        break;

        case 'r':
            if(position[1] < colCount - 1) { //< max nmber of rows? then move up
                position[1] += 1;
            } else {
                console.log("You can't move down from the last row. Game over.");
                endGame = true;
            }           
        break;

        default:
            console.log("Invalid input: 'U'p, 'D'own, 'L'eft and 'R'ight only")
        break;
    }

    if (!endGame){
        switch (generatedField[position[0]][position[1]]) { //winning condition
            case hat:
                console.log("You won, congratulations!")
                endGame = true;
                break;
            case hole: //losing condition
                console.log("You fell down a hole! Game over.")
                endGame = true;
                break;
            default: //continue by updating the screen
                myField.clearScreen();

                generatedField[position[0]][position[1]] = pathCharacter; 
                myField.print();
                break;
        }
    }
}



