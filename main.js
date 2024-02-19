const prompt = require('prompt-sync')({sigint: true});

/* The Field class in JavaScript represents a grid and provides methods for printing the grid, clearing
the screen, and generating a random position within the grid. */
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

/* The lines `rowCount = prompt('How many rows do you want?');`, `colCount = prompt('How many columns
do you want?');`, and `numOfHoles = prompt('How many holes do you want (as a percentage) 1-100?');`
are prompting the user to input values for the number of rows, number of columns, and the percentage
of holes they want in the grid, respectively. */
rowCount = prompt('How many rows do you want?');  
colCount = prompt('How many columns do you want?');
numOfHoles = prompt('How many holes do you want (as a percentage) 1-100?');    

/* This line of code is creating a 2D array representing the grid for the game. */
generatedField = new Array(parseInt(rowCount)).fill(null).map(() => new Array(parseInt(colCount)).fill(fieldCharacter));

/* Generates a random starting position within the grid for the game. */
position = Field.randomPositionInArray(parseInt(rowCount -1 ), parseInt(colCount - 1));

/* Sets the character represented by`pathCharacter` at the position specified by the `position` array within the `generatedField` grid.
This is used to mark the current position of the player in the game grid with the character denoted
by `pathCharacter`, which typically represents the path the player has taken. */
generatedField[position[0]][position[1]] = pathCharacter;

/* This generates a random position within the grid for placing the hat in the game. */
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

/* This block of code is calculating the number of holes to create in the game grid based on the
percentage of holes specified by the user.*/
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

/* `const myField = new Field(generatedField);` is creating a new instance of the `Field` class using
the `generatedField` array as the grid parameter. This line initializes a new object `myField` that
represents the game field with the grid layout specified by the `generatedField` array. This object
can then be used to interact with the game field, such as printing the grid, updating player
positions, and checking for game conditions like winning or losing. */
const myField = new Field (generatedField);

/* `myField.print();` is a method call that is printing the current state of the game grid represented
by the `myField` object. This method is responsible for displaying the grid layout to the user,
showing the player's current position marked by the `pathCharacter`, the location of the hat (`^`),
and the positions of any holes (`O`) that have been generated in the grid. The printed grid provides
a visual representation of the game environment, allowing the player to see their surroundings and
make decisions on how to navigate through the grid. */
myField.print();


/* This is responsible for outputting information to the console for the user to see during the game execution. */
console.log(`Number of holes created: ${holesCreated}`);
console.log(`You are the * in the top left corner of a ${colCount} x ${rowCount} grid. `)


/* This is initializing a variable `endGame` with a boolean value of `false`. This
variable is used as a flag or indicator in the game loop to control the flow of the game. When
`endGame` is `false`, the game loop continues to execute, allowing the player to make moves and
interact with the game environment. Once certain conditions are met, such as winning the game,
falling into a hole, or making an invalid move, `endGame` is set to `true`, which triggers the end
of the game loop and stops the game execution. This variable helps in managing the game state and
determining when the game should end based on different scenarios encountered during gameplay. */
let endGame = false;


/* This block of code is the main game loop responsible for handling the player's input, updating the
game state based on the input, and checking win/lose conditions. */
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
        switch (generatedField[position[0]][position[1]]) { 
            case hat: //Winning condition
                console.log("You won, congratulations!")
                endGame = true;
                break;
            case hole: //losing condition
                console.log("You fell down a hole! Game over.")
                endGame = true;
                break;
            default: //continue by updating the screen
                myField.clearScreen();

                /* This is updating the position in the `generatedField` grid at the coordinates specified by the `position` array with the character represented by `pathCharacter`. This step is marking the current position of the player in the game grid with the character denoted by `pathCharacter`, which typically represents the path the player has taken. */
                generatedField[position[0]][position[1]] = pathCharacter; 
                myField.print();
                break;
        }
    }
}



