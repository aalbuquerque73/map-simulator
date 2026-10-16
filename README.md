# Task

Create a map with a specified width and height, then simulate an object moving through the map according to a sequence of commands read from standard input (stdin).

The application must verify that the object remains inside the map throughout the simulation. Valid coordinates range from `0` to `width - 1` on the X-axis and from `0` to `height - 1` on the Y-axis.

The runner does not validate whether the object's initial position is inside the map. Position validation is performed after each movement. If the object starts outside the map but its first movement places it inside the map, the simulation continues normally. However, if the object is still outside the map after its first movement, the simulation ends immediately, and any remaining input is ignored.

At the end of the simulation, the application prints the object's final position to standard output (stdout):

* (x, y) — the object's final position if it has remained inside the map throughout the simulation.
* (-1, -1) — if the object leaves the map at any point during the simulation. The simulation ends immediately, and any remaining input is ignored.

# Running the Project

The project uses Node.js and ES modules. No additional dependencies are required.

## Run the application

`npm start`

## Run with input from a file

The application reads input from standard input (stdin). To provide input from a file, use:

Bash:

`cat args.txt | npm start`

PowerShell:

`Get-Content args.txt -Raw | npm start`

# Testing

The project uses the built-in Node.js test runner (node:test) and assertion module (node:assert). No additional testing frameworks or dependencies are required.

Each module has a corresponding test file:

* `mac-guffin.test.js` — tests the MacGuffin module.
* `map.test.js` — tests the map module.
* `state-machine.test.js` — tests the state machine.
* `runner.test.js` — tests the input runner.

## Run all tests

`npm test`

Node.js automatically discovers and executes the test files.

## Run a specific test file

To run tests for an individual module:

`node --test tests/mac-guffin.test.js`
`node --test tests/map.test.js`
`node --test tests/state-machine.test.js`
`node --test tests/runner.test.js`

## Test requirements

* Use a Node.js version that supports the built-in test runner (node:test).

# Runner

Reads from the stdin a list of values separated by spaces, comas or semicolons

* The first two values specify the map's width and height.
* The next two values specify the object's initial `X` and `Y` coordinates.
* The remaining values specify the commands to execute. See [commands rule](#commands)
* Values that are not numeric are converted to `0`
* The simulation stops when it processes the first `0` command or when there are no more input values to process.
* If the object leaves the map after a movement, the simulation stops immediately, regardless of whether more input remains.

## Example of valid inputs:

**Input 1**
```txt
4,4 2,2
1,4,1,3,2,3,2,4,1,0
```

**Input 2**
```txt
4,4 2,2 1,4,1,3,2,3,2,4,1,0
```

**Input 3**
```txt
4,4,2,2,1,4,1,3,2,3,2,4,1,0
```

# Rules

* The map origin (0, 0) is at the top left.
* The map's valid X coordinates range from 0 to width - 1.
* The map's valid Y coordinates range from 0 to height - 1.
* The object has a direction: north, east, south or west
* The initial direction is north

# Movement

| Direction |  X |  Y |
|-----------|----|----|
| north     |  0 | -1 |
| east      |  1 |  0 |
| south     |  0 |  1 |
| west      | -1 |  0 |

# Commands

* 0 - quit simulation and print result
* 1 - move forward one step in the current direction
* 2 - move backwards one step, opposite to the current direction
* 3 - rotates 90 degrees clockwise (north -> east -> south -> west -> north)
* 4 - rotates 90 degrees counterclockwise (north -> west -> south -> east -> north)

**Note:**
The state-machine stops processing values once it encounters a `0`, the object leaves the map or doesn't have any more inputs to run.
