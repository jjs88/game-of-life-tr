var Game = (function() {



    'use strict';

    //private variables accessible within function
    var ctx, grid, stateChangeGrid, xCoord, yCoord, startBtn, stopBtn, id;
    



    function init() {
        
        cacheDOM();
        events();
    }


    function cacheDOM() {
        
        startBtn = document.getElementsByClassName('btn')[0];
        stopBtn = document.getElementsByClassName('btn')[1];

        ctx = document.getElementById('myCanvas').getContext('2d');
        ctx.fillStyle = "#d02fd0";

         // grid size
         xCoord = 400;
         yCoord = 400;

        //create separate arrays each with own memory location
        grid =  createArray(xCoord); 
        stateChangeGrid = createArray(xCoord);
    }

        
    function events() {

        startBtn.addEventListener('click', startGame);
        stopBtn.addEventListener('click', stopGame);

    }


    function startGame(e) {

        e.preventDefault();

        createGrid(); 
        fillLiveCells();
        runGame();
        toggleHidden(startBtn); //hide start btn
        toggleHidden(stopBtn); // display stop btn


    }


    function stopGame(e) {

        e.preventDefault();

        window.cancelAnimationFrame(id);
        toggleHidden(startBtn);
        toggleHidden(stopBtn);
    }


    function toggleHidden(element) {

        if(!element.classList.contains('hidden')) {
            element.classList.add('hidden');
        } else {
            element.classList.remove('hidden');
        }
    }


    function runGame() {

        updateGrid();

        id = requestAnimationFrame(function() {
            runGame();
        })
    }


    function getOneOrZero() {

        var random = Math.random(); //get a random number 0-1

        random = (random * 2); //convert it to an int

        return Math.floor(random); // return 0 or 1
    }


    function createArray(rows) { 
        //need to create array with inner array before we can turn it into a jagged array aka 2d array
        var arr = [];

        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }
        return arr;
    }


    function createGrid() {

        //dyanamically create the 2d array
        //can now automatically tack on y value for 2d after initial array creation 

         //x coord
        for(var x=0; x < xCoord; x++) {

            //y coord --> now we can set the y coordinate since it exists from first grid loop
            for(var y = 0; y < yCoord; y++) {

                var binary = getOneOrZero();

                if (binary === 1) {

                    grid[x][y] = 1;

                } else {

                    grid[x][y] = 0;
                }
            }
        }
    }


    function fillLiveCells() {

        // start x,y at 1 and end 1 before last row/column
        for (var x = 1; x < xCoord-1; x++) { 

            for (var y = 1; y < yCoord-1; y++) { 

                // only fill canvas with live cells = 1
                if (grid[x][y] === 1) {
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
   

    function updateGrid() {

       // start the loops at 1 to avoid the edges and end at -1 as well otherwise errors 
        var fate;
        var state;
        var cnt;

        //x coordinate values
        for(var x = 1; x < xCoord-1; x++) {
            
            //y coordinate values
            for(var y = 1; y < yCoord-1; y++) {
 
                state = grid[x][y];
                cnt = getNeighborCnt(grid,x,y);

                // living cell
                if(state === 1) {

                    if(cnt < 2) {
                        fate = 0;
                    } else if (cnt === 2) {
                        fate = 1;
                    } else if (cnt === 3) {
                        fate = 1;
                    } else if (cnt > 3) {
                        fate = 0;
                    } else {
                        //default
                        fate = 0;
                    }
                }

                //dead cell
                if(state === 0) {

                    if(cnt === 3) {
                        fate = 1;
                    } else {
                        // default
                        fate = 0;
                    }
                }

                //set new state alive or dead
                stateChangeGrid[x][y] = fate;
            }
        }    

        // set orig grid to new state (must run loop to change values)
        for (var x = 0; x < xCoord; x++) { //iterate x coords
            
            for (var y = 0; y < yCoord; y++) { //iterate y coords

                grid[x][y] = stateChangeGrid[x][y];
            }
        }

        //now repaint the canvas element with new state
        repaint(grid);
    }


    function repaint(grid) {
 
        ctx.clearRect(0,0, xCoord, xCoord); //clear canvas

        for(var x = 1; x < xCoord-1; x++) {
        
            for(var y = 1; y < yCoord-1; y++) {

                if(grid[x][y] === 1) {
    
                    ctx.fillRect(x,y,1,1); //repaint canvas
                }
            
            }
        }
    }

  
    
    function getNeighborCnt(grid, x, y) {

        var cnt = 0;

        // perform logic to get the number of dead or alive neighbor pixels

        //top left
        if(grid[x-1][y-1] === 1) {
            cnt++;
        }

        // //top middle
        if(grid[x][y-1] === 1) {
            cnt++;
        }

        // //top right 
        if(grid[x+1][y-1] === 1) {
            cnt++;
        }

        // //middle left 
        if(grid[x-1][y] === 1) {
            cnt++;
        }

        // //middle right
        if(grid[x+1][y] === 1) {
            cnt++;
        }

        // //bottom left
        if(grid[x-1][y+1] === 1) {
            cnt++;
        }

        // //bottom middle
        if(grid[x][y+1] ===1) {
            cnt++;
        }

        // //bottom right
        if(grid[x+1][y+1] === 1) {
            cnt++;
        }

        return cnt;

    }



  

    // API to expose to global
    return {
        init:init
    }


    // example call 
    // Game.init();



})();