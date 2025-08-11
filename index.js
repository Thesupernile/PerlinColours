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
        for (row of this.grid){
            for (angle of row){
                angle += increment;
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
            const XDist = Math.abs((x - gridX) - (pointX - gridX));
            const YDist = Math.abs((y - gridY) - (pointY - gridY));

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
    let scaleIncrement = 127.5;

    for (let i = 0; i < 9; i += 0.1){
        for (let j = 0; j < 9; j += 0.1){
            let perlinValue = perlinNoise.calculatePerlin(i, j);
            console.log(perlinValue);
            let colourValue = scaleIncrement + scaleIncrement * perlinValue;
            ctx.fillStyle = `rgb(${colourValue}, ${colourValue}, ${colourValue})`;
            ctx.fillRect(i * 100, j * 100, 10, 10);
        }
    }
}

function canvasClear(){
  // Clear Canvas
  ctx.fillStyle = "rgba(222, 230, 246, 1)";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resizePage() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;
  
  testPerlin();
}

window.onload = window.onresize = function () {
  resizePage();
};
