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
const GRIDSIZE = 10;
const PIXELSPERSQUARE = 50;

function testPerlin(){
    let perlinNoise = new PerlinNoiseGrid2D(GRIDSIZE);
    // Get the fist colour
    let colour1R = parseInt(document.getElementById("colour1R").value);
    let colour1G = parseInt(document.getElementById("colour1G").value);
    let colour1B = parseInt(document.getElementById("colour1B").value);

    // Get the second colour
    let colour2R = parseInt(document.getElementById("colour2R").value);
    let colour2G = parseInt(document.getElementById("colour2G").value);
    let colour2B = parseInt(document.getElementById("colour2B").value);

    // Find the midpoints of the colours
    let midPointR = (colour1R + colour2R) / 2;
    let midPointG = (colour1G + colour2G) / 2;
    let midPointB = (colour1B + colour2B) / 2;


    // Calculate what "one" unit of change is (since perlin noise is from -1 to 1 this is half the difference of the two colour values)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scaleIncrementR = (colour1R - colour2R)/2;
    const scaleIncrementG = (colour1G - colour2G)/2;
    const scaleIncrementB = (colour1B - colour2B)/2;
    const pixelIncrement = 1/PIXELSPERSQUARE;


    // Draw the perlin noise gradient
    for (let i = 0; i < GRIDSIZE-1; i += pixelIncrement){
        for (let j = 0; j < GRIDSIZE-1; j += pixelIncrement){
            let perlinValue = perlinNoise.calculatePerlin(j, i);
            let colourValueR = scaleIncrementR + (scaleIncrementR * perlinValue) + colour2R;
            let colourValueG = scaleIncrementG + (scaleIncrementG * perlinValue) + colour2G;
            let colourValueB = scaleIncrementB + (scaleIncrementB * perlinValue) + colour2B;

            ctx.fillStyle = `rgb(${colourValueR}, ${colourValueG}, ${colourValueB})`;
            ctx.fillRect(j * (GRIDSIZE/pixelIncrement), i * (GRIDSIZE/pixelIncrement), canvas.width/(GRIDSIZE/PIXELSPERSQUARE), canvas.height/(GRIDSIZE/PIXELSPERSQUARE)); 
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
