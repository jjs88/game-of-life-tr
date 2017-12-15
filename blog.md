## Game of Life
### What I Learned
---

In this post I will be talking about Conway's Game of Life project that I had to build for Bov Academy. The three areas that I want to talk about are how to deal with the edge cells on the canvas, how to handle the state change of each cell, and finally the logic to determine whether a cell lives or dies.

### Game Objective


### Game State

When dealing with the storage and state of the game, I first had to figure out what data structure I was going to use for the x and y coordinates. Since a canvas element operates on a x and y coordinate plane, a 2D array would suit the storage of the data perfectly. As for the value, I will be storing a 1 or a 0 for each x,y point. This will determine whether a cell (point) is alive or dead.


##### Create the Arrays
In order to create the 2D array, I created a helper function that does a loop and populates my given array variable with an inner array for each iteration.


````
 function createArray(rows) { 
        //need to create array with inner array before we can turn it into a jagged array aka 2d array
        let arr = [];
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }
        return arr;
    }
    
    grid =  createArray(400); 
    stateChangeGrid = createArray(400);
```` 

The above code will create an array that holds 400 inner arrays ( [0][1][2], etc ). This is not a 2D array yet since we want [x][y] format. The inner array we create here is just the first half (x value). 

You will notice that I created two arrays. This is very important since we want two arrays that both will mimick the 400 x 400 canvas coordinate plane. The grid array will always be the current state of the game, and the stateChangeGrid will be used to modify each cell (point) to hold the new state value of each point in the grid array (1 or 0 value) when we perform the logic. We will talk about this in the logic section.

Now that we have the two array variables properly populated, we can create the full array grid.

We do this by performing 2 for loops. The first loop will be our x coordinate, and the second will be the y coordinate. We already created the x coordinate when we initially created the array. Now we need to dynamically make it a 2D array.

``note: We can't create the 2D array in one swoop, so this is why we are doing it again for the y coordinate.``


````
	 function createGrid() {

        for(var x=0; x < xCoord; x++) {

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

````

In the above code, we are creating the 2D array which will give us our x,y coordinates ([x][y]). We are also performing logic to call another helper function. This function will randomly return back a 1 or 0 value. This is the value that will be stored for each x,y point in the 2D array.

For example:


````
grid[0][0] = 1;
grid[100][100] = 0;
````

Now that we have all coordinates and values for our grid array, we can use it to paint the canvas for the starting state of the game.

##### Initial Painting of the Canvas

The canvas element provides us a function we will use in order to paint it. 

````
 ctx.fillRect(x, y, 1, 1);
 ````
 
 You can see that it takes an x and  y coordinate. The other two values just mean that it will be 1 pixel. So in order to paint the canvas, we will need to cycle through the grid once more using 2 for loops and get each x and y value. Let's look at the helper function I created that does this.
 
 ````
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
````

In the above code, I am performing the two for loops, however, I am starting at ``1`` and then going up to ``-1``. The purpose of this is to deal with the edges of the game. The edges are not surrounded by 8 neighbors, so we can't really perform the game logic on the edges. In order to get around this, we will only fill the canvas points that are not the edges. So, we are essentially saying that the coordinates that come right before the edge is the "edge". So when we perform the live/die logic of these "edge" coordinates, they will use the real edge coordinates since the grid array holds all x, y coordinates.

Another thing you will notice is that we are only painting the x,y point that has a value of 1. This is because these are the live cells (points), so they need to get painted to the canvas for the start of the game.

#### Updating the Grid (live / die logic)

Notice that we haven't done anything with our duplicate array we initially created, `stateChangeGrid`. It is during the updating of the grid and repainting the canvas that we will now use it.

When we go to update the grid, there are a few things that need to happen. First, we will once again perform our 2 for loops to access the x and y coordinates of the ``grid`` array. Once we have the current [x][y] coordinates, we will then access the value (1/0) to determine if the cell is alive or dead. We will start the loop at 1 and end at -1, since this is our "edge".

````
//x coordinate values
        for(var x = 1; x < xCoord-1; x++) {
            
            //y coordinate values
            for(var y = 1; y < yCoord-1; y++) {
````            

##### live cell logic
If the cell is currently living (=1), logic will then be performed to look at each of the 8  neighboring cells to determine whether the cell will continue living or die (=0). The below logic is performed on each neighbor to see if they are alive or dead. If alive, we will increment the `cnt` variable. At the end of the function, the total count will be returned and used to determine if the current cell lives or dies.

````
function getNeighborCnt(grid, x, y) {

        let cnt = 0;

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
````

````
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
````  

You can see that logic is then performned on the `cnt` variable to determine if it lives or dies. The `fate` variable will hold the value of 1 or 0.  

##### dead cell logic       

On the otherhand, if the current cell is dead, the logic is more straight forward. 

````

                //dead cell
                if(state === 0) {

                    if(cnt === 3) {
                        fate = 1;
                    } else {
                        // default
                        fate = 0;
                    }
                }
````

You can see that the dead cell will only become live if only 3 neighbors are alive. Otherwise, just keep it dead.

#### Changing the State

When the live or die logic is done, the last part to be performed is to update the `stateChangeGrid` with the new value. 


##### Updating the stateChangeGrid Array
The first time this logic runs, there will be no y coordinate array value. However, since javascript is dynamic, we are essentially creating the 2D array value on the fly when we run it the first time. The x coordinate was already there, we are now tacking on the y coordinate and assigning the value of the variable `fate`.

````
 //set new state alive or dead
                stateChangeGrid[x][y] = fate;
````

Here, we are taking the `fate` variable value, and changing it on the array. Once the loop completes and all the coordinates have been updated, we then need to update the original grid array with these new values. Now, the reason we update the values on the other array is because we can't be changing the state of the game as we are doing the loops, that would lead the game to not behave correctly. 

##### Updating the Grid Array        

When we update the original array, we once again perform a loop on our grid coordinates (400 x 400). Now, you can't just do grid = stateChangeGrid since the actual values of the grid array will not change due to the concept of "by reference". 

````

   // set orig grid to new state (must run loop to change values)
        for (var x = 0; x < xCoord; x++) { //iterate x coords
            
            for (var y = 0; y < yCoord; y++) { //iterate y coords

                grid[x][y] = stateChangeGrid[x][y];
            }
        }
````

The above code updates the original array. Now, as I was writing this, I realized that as we copy the values, we are leaving out the real edge coordinates since we start the loop at 1 and -1. So, after the first run and the orig grid is updated, all the edge coordinates will have a value of undefined. So, the game logic is slightly affected since the actual count will be off for these neighboring cells. The good news is, the game still runs as intended, but the cells that use the actual edge cells for the live/die logic will be a little off.

We can get around this by changing the grid update to start at 1 and end at -1. If you run the game with this logic, you will see more alive pixels "stuck" around the edges. Because of this, I prefer to leave the code as originally intended until I make the fix.

#### Repaining the Canvas

Now that the grid has been fully updated with the changed state, we can repaint the canvas with the new values. I have created a helper function which performs this task.

````

    function repaint(grid) {
 
        ctx.clearRect(0,0, xCoord, xCoord); //clear canvas

        for(var x = 1; x < xCoord-1; x++) {
        
            for(y = 1; y < yCoord-1; y++) {

                if(grid[x][y] === 1) {
    
                    ctx.fillRect(x,y,1,1); //repaint canvas
                }
            
            }
        }
    }
````

Once again, we perform the 2 for loops starting at 1 and ending at -1. If the value of the grid point is a 1, that means that the point needs to be alive and we will repaint it to the canvas. Once this is done, the iteration of the game is complete and it is called again.

#### Starting the Game

In order to start the game, I created a wrapper function that calls the `createGrid` function, `fillLiveCells` function, and then the `rungame` function.

````
    function startGame(e) {

        e.preventDefault();

        createGrid(); 
        fillLiveCells();
        runGame();


    }
````

runGame is another function that actually performs the continous loop.

````

    function runGame() {

        updateGrid();

        requestAnimationFrame(function() {
            runGame();
        })
    }
````

This loop essentially continously updates the grid and repaints the canvas via the `updateGrid` function. Now, the reason it runs in the loop is because the `requestAnimationFrame` function is a timed loop. We need to manually cancel the loop just like with setInterval. 








   



