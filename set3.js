/**
 * Set 3
 *
 * This assignment will develop your ability to manipulate data.
 * You should be ready for JS tutorials on more advanced topics after this.
 *
 * Please refer to the `module4/sample-data/set3-sample-data.js` file for examples of:
 * - the `socialGraph` parameter for `relationshipStatus`
 * - the `board` parameter for `ticTacToe`
 * - the `routeMap` parameter for `eta`
 */

/**
 * Relationship status
 *
 * Let's pretend that you are building a new app with social media functionality.
 * Users can have relationships with other users.
 *
 * The two guidelines for describing relationships are:
 * 1. Any user can follow any other user.
 * 2. If two users follow each other, they are considered friends.
 *
 * This function describes the relationship that two users have with each other.
 *
 * Please see the sample data for examples of `socialGraph`.
 *
 * @param {string} fromMember The subject member
 * @param {string} toMember The object member
 * @param {object} socialGraph The relationship data
 * @returns {string} "follower" if fromMember follows toMember;
 * "followed by" if fromMember is followed by toMember;
 * "friends" if fromMember and toMember follow each other;
 * "no relationship" otherwise.
 */
function relationshipStatus(fromMember, toMember, socialGraph) {

    let x = 0 
    let y = 0

    if (fromMember === "" || toMember === ""){
        return("no relationship")
    }
    for(i=0; i<Object.entries(socialGraph[fromMember].following).length;i++){
        if (socialGraph[fromMember].following[i] === toMember){
            x = 1
        }
    }    
    for (j=0; j<Object.entries(socialGraph[toMember].following).length; j++){
        if (socialGraph[toMember].following[j] === fromMember){
            y = 1
        }
    }
    
    if (x === 1 && y === 1){
        return("friends")
    }
    if (x === 0 && y === 1){
        return("followed by")
    }
    if (x === 1 && y === 0){
        return("follower")
    }
    if (x === 0 && y === 0){
        return("no relationship")
    }
}

/**
 * Tic tac toe
 *
 * Tic Tac Toe is a common paper-and-pencil game.
 * Players must attempt to draw a line of their symbol across a grid.
 * The player that does this first is considered the winner.
 *
 * This function evaluates a Tic Tac Toe game board and returns the winner.
 *
 * Please see the sample data for examples of `board`.
 *
 * @param {Array} board The representation of the Tic Tac Toe board as a square array of arrays. The size of the array will range between 3x3 to 6x6.
 * The board will never have more than 1 winner.
 * There will only ever be 2 unique symbols at the same time.
 * @returns {string} the symbol of the winner, or "NO WINNER" if there is no winner.
 */
function ticTacToe(board) {
    const size = board.length

    if (size < 3 || size > 6 || board.some(row => row.length !== size)) {
        return "NO WINNER"
    }

    for (let i = 0; i < size; i++) {
        if (board[i][0] !== '' && board[i].every(cell => cell === board[i][0])) {
            return board[i][0] 
        }

        let columnSymbol = board[0][i]
        if (columnSymbol !== '' && board.every(row => row[i] === columnSymbol)) {
            return columnSymbol
        }
    }

    let mainDiagonalSymbol = board[0][0]
    let antiDiagonalSymbol = board[0][size - 1]
    
    if (mainDiagonalSymbol !== '' && board.every((row, index) => row[index] === mainDiagonalSymbol)) {
        return mainDiagonalSymbol // Winner found in main diagonal
    }
    
    if (antiDiagonalSymbol !== '' && board.every((row, index) => row[size - 1 - index] === antiDiagonalSymbol)) {
        return antiDiagonalSymbol 
    }

    return "NO WINNER"
}


    // if same all to the left and to the right diagonals 


/**
 * ETA
 *
 * A shuttle van service is tasked to travel one way along a predefined circular route.
 * The route is divided into several legs between stops.
 * The route is fully connected to itself.
 *
 * This function returns how long it will take the shuttle to arrive at a stop after leaving anothe rstop.
 *
 * Please see the sample data for examples of `routeMap`.
 *
 * @param {string} firstStop the stop that the shuttle will leave
 * @param {string} secondStop the stop that the shuttle will arrive at
 * @param {object} routeMap the data describing the routes
 * @returns {Number} the time that it will take the shuttle to travel from firstStop to secondStop
 */
function eta(firstStop, secondStop, routeMap) {
    let time = 0
    let currentStop = firstStop
    
    const routeStops = Object.keys(routeMap).map(route => route.split(","))
    
    while (true) {
        for (let i = 0; i < routeStops.length; i++) {
            const [start, end] = routeStops[i]

            if (start === currentStop) {
                time += routeMap[start + "," + end].travel_time_mins
                currentStop = end

                if (currentStop === secondStop) {
                    return time
                }
            }
        }
    }
}
//while(not same)