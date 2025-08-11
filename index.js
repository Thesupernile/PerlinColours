class PerlinNoiseGrid2D {

    constructor(gridSize){
        this.gridSize = gridSize;
        this.grid = [[]];
        this.#generateGrid();
    }

    #generateGrid(){
        let grid = [];
        for(let i = 0; i < this.gridSize; i++){
            let row = [];
            for (let j = 0; j < this.gridSize; j++){
                // Generate a random number between 0 and 360 as the angle of the unit vector for each point
                let gridPointAngle = Math.random() * 360;
                row.push(gridPointAngle);
            }
            grid.push(row);
        }
        this.grid = grid;
    }

    incrementGrid(increment){
        for (let i = 0; i < this.grid.length; i++){
            for (let j = 0; j < this.grid[i].length; j++){
                this.grid[i][j] += increment;
                this.grid[i][j] = this.grid[i][j] % 360;
            }
        }
    }

    calculatePerlin(x, y){
        // Find the bottom left point in the square
        let gridX = Math.floor(x);
        let gridY = Math.floor(y);

        let points = [[gridX, gridY], [gridX + 1, gridY], [gridX, gridY + 1], [gridX + 1, gridY + 1]];
        let pointValues = [];

        for (const [pointX, pointY] of points){
            const angle = this.grid[pointY][pointX];
            // Calculate the distances to the required points
            const XDist = (pointX - gridX) - (x - gridX);
            const YDist = (pointY - gridY) - (y - gridY);

            // Calculate the dot product
            let pointValue = XDist * Math.cos(angle) + YDist * Math.sin(angle);

            pointValues.push(pointValue);
        }

        // Interpolation

        // Find what percent along the X axis we are
        let XPercent = (x - gridX);
        let semiInterpolatedValues = [];
        for (let i = 0; i < pointValues.length; i += 2){
            let semiInterpolatedValue = (1 - XPercent) * pointValues[i] + XPercent * pointValues[i + 1];
            semiInterpolatedValues.push(semiInterpolatedValue);
        }

        let YPercent = (y - gridY);
        let finalValue = (1 - YPercent) * semiInterpolatedValues[0] + YPercent * semiInterpolatedValues[1];

        return finalValue;
    }

}

const canvas = document.getElementById("perlinTestCanvas");
const ctx = canvas.getContext("2d");

function testPerlin(){
    let perlinNoise = new PerlinNoiseGrid2D(10);
    let colour1R = document.getElementById("colour1R").value;
    let colour1G = document.getElementById("colour1G").value;
    let colour1B = document.getElementById("colour1B").value;

    let colour2R = 0;
    let colour2G = 0;
    let colour2B = 0;

    let midPointR = (colour1R + colour1R) / 2;
    let midPointG = (colour1G + colour1G) / 2;
    let midPointB = (colour1B + colour1B) / 2;


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scaleIncrementR = (colour1R - colour2R)/2;
    const scaleIncrementG = (colour1G - colour2G)/2;
    const scaleIncrementB = (colour1B - colour2B)/2;
    const pixelIncrement = 0.05;


    for (let i = 0; i < 9; i += pixelIncrement){
        for (let j = 0; j < 9; j += pixelIncrement){
            let perlinValue = perlinNoise.calculatePerlin(j, i);
            console.log(perlinValue);
            let colourValueR = scaleIncrementR + (scaleIncrementR * perlinValue) + colour2R;
            let colourValueG = scaleIncrementG + (scaleIncrementG * perlinValue) + colour2G;
            let colourValueB = scaleIncrementB + (scaleIncrementB * perlinValue) + colour2B;

            ctx.fillStyle = `rgb(${colourValueR}, ${colourValueG}, ${colourValueB})`;
            ctx.fillRect(j * (10/pixelIncrement), i * (10/pixelIncrement), 10, 10); 
        }
    }
}

function canvasClear(){
  // Clear Canvas
  ctx.fillStyle = "rgba(222, 230, 246, 1)";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateCanvas(){
    // Currently non-functional
    perlinNoise.incrementGrid();
    testPerlin();
    setTimeout(updateCanvas, 1000);
}

function resizePage() {
  canvas.width = window.innerWidth * 0.99;
  canvas.height = window.innerHeight * 0.90;
  
  testPerlin();
}

window.onload = window.onresize = function () {
    resizePage();
};
