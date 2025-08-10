class PerlinNoiseGrid {

    constructor(gridSize, gridDensity, ){
        this.gridSize = gridSize;
        this.gridDensity = gridDensity;
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
    }

    calculatePerlin(x, y){

    }

}
