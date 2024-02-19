const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let position = [];

class Field { 
    constructor(grid) {
        this.position = [0, 0];
        this.grid = grid;
        
        this.dimensions = [grid.length, grid[0].length]; // [rows, columns]
        console.log(`You are the * in the top left corner of a ${this.dimensions[0]} x ${this.dimensions[1]} grid. `)
        this.clearScreen();
    }

    print() {
        for (let row of this.grid) {
            console.log(row.join(''));
        };
    }

    getPosition() {
        return this.position;
        
    }   
    setRow(row) {
        this.position[0] = row;
        //console.log(`new row = ${this.position[0]}`)

    }
    setColumn(col) {
        this.position[1] = col;
        //console.log(`new column = ${this.position[1]}`)
    }
    getDimensions() {
        return this.dimensions;
    }
    clearScreen() {
        process.stdout.write("\u001b[2J\u001b[0;0H"); //clears the terminal screen
    }
}


const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]);

    
myField.print();
let endGame = false;

while (!endGame) {
let userInput = prompt('Which way?');
//'U'p, 'D'own, 'L'eft and 'R'ight only
    switch (userInput) {
        case 'u':
            newRow = myField.getPosition()[0];
            if(newRow) { // >0? then valid to move up/
                myField.setRow(newRow -1);
            } else {
                console.log("You can't move up from the top row. Game over.")
                endGame = true;
            }                   
        break;
        case 'd':
            newRow = myField.getPosition()[0];
            dim = myField.getDimensions()[0];
            if(newRow < dim - 1) { //< max nmber of rows? then move up
                myField.setRow(newRow + 1);
            } else {
                console.log("You can't move down from the last row. Game over.");
                endGame = true;
            }
            
        break;
        case 'l':
            newCol = myField.getPosition()[1];
            if(newCol) {
                myField.setColumn(newCol - 1);
            } else {
                console.log("You can't move left from the first column. Game over.")
                endGame = true;
            } 
            
            break;
        case 'r':
            newCol = myField.getPosition()[1];
            dim = myField.getDimensions()[0];
            if(newCol < dim - 1) {
                myField.setColumn(newCol + 1)
            } else {
                console.log("You can't move right from the last column. Game over.")
                endGame = true;
            }
            
        break;
        default:
            console.log("Invalid input: 'U'p, 'D'own, 'L'eft and 'R'ight only")
        break;
    }

    if (!endGame){
        switch (myField.grid[myField.getPosition()[0]][myField.getPosition()[1]]) { //winning condition
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
                let currentPosition = myField.getPosition();
                myField.grid[myField.getPosition()[0]][myField.getPosition()[1]] = pathCharacter; 
                myField.print();
                break;
        }
    }
}



