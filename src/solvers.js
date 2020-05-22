/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(k) {
  //create a new n size empty board
  var solution = new Board({n:k});
  //iterate thru each rows of the board
  for (let i = 0; i < k; i++) {
    //place rooks in a same col as row
    solution.rows()[i][i] = 1;
  }

  console.log('Single solution for ' + k + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  //initize solution
  var solutionCount = 1;
  //for each n size
  for(var i=1;i<=n;i++){
    //make solution to multiply
    solutionCount *= i;
  };

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(k) {
  if(k===0){
    return [];
  }
  // if(k === 1){
  //   return [[1]];
  // }
  var board = new Board({n:k});
  var depth = k;
  var boardSize = k;
  var completeDepth = false;

  var solutionSearch = function(board, depth){
    //initiate an array storing all used column.
    var queenConflict = false;
    //if it is the base case (at 0)
    var solution= [];
    //if we are at depth 0
    if(depth === 0){
      var array = [];
      var solutionString = JSON.stringify(board);
      array.push(solutionString);
      // console.log(board);
      // array.push(board);
      return array;
    }
    //start a loop from 0 to board size
    for(var i=0;i<boardSize;i++){
        //place a queen at i column;
        board.rows()[boardSize-depth][i] = 1;
        // board.togglePiece(boardSize-depth,i)
        //if we are at depth 4
        if(depth !== boardSize){
          //skip all the checking.
          queenConflict = board.hasAnyQueensConflicts();
        }
        //check if there is a queen conflict
        if(!queenConflict){
          //if there is not go to the next depth.
          var temp = solutionSearch(board,depth-1);
          solution = solution.concat(temp);
          board.rows()[boardSize-depth][i] =0;
          // board.togglePiece(boardSize-depth,i);


          //if there is a conflict and i is the last one, return back;
        }else if(queenConflict && i===boardSize-1){
          board.rows()[boardSize-depth][i] = 0;
          // board.togglePiece(boardSize-depth,i);
          completeDepth = true;
          break;
        }else{
           board.rows()[boardSize-depth][i] = 0;
          //  board.togglePiece(boardSize-depth,i);
        }
    }
    return solution
  }

  var solution = solutionSearch(board,depth);
  var result =  [];
  if(solution.length === 0 ){
    var emptyBoard = new Board({n:k});
    return emptyBoard.rows();
  }else{
    var solnBoard = JSON.parse(solution[0]);
    for(var i=0;i<k;i++){
      result.push(solnBoard[i]);
    }
  }




  console.log('Single solution for ' + k + ' queens:', JSON.stringify(result));
  return result;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(k) {
  if(k===0){
    return 1;
  }
  // if(k === 1){
  //   return [[1]];
  // }
  var board = new Board({n:k});
  var depth = k;
  var boardSize = k;
  var completeDepth = false;

  var solutionSearch = function(board, depth){
    //initiate an array storing all used column.
    var queenConflict = false;
    //if it is the base case (at 0)
    var solution= [];
    //if we are at depth 0
    if(depth === 0){
      var array = [];
      var solutionString = JSON.stringify(board);
      array.push(solutionString);
      // console.log(board);
      // array.push(board);
      return array;
    }
    //start a loop from 0 to board size
    for(var i=0;i<boardSize;i++){
        //place a queen at i column;
        board.rows()[boardSize-depth][i] = 1;
        // board.togglePiece(boardSize-depth,i)
        //if we are at depth 4
        if(depth !== boardSize){
          //skip all the checking.
          queenConflict = board.hasAnyQueensConflicts();
        }
        //check if there is a queen conflict
        if(!queenConflict){
          //if there is not go to the next depth.
          var temp = solutionSearch(board,depth-1);
          solution = solution.concat(temp);
          board.rows()[boardSize-depth][i] =0;
          // board.togglePiece(boardSize-depth,i);


          //if there is a conflict and i is the last one, return back;
        }else if(queenConflict && i===boardSize-1){
          board.rows()[boardSize-depth][i] = 0;
          // board.togglePiece(boardSize-depth,i);
          completeDepth = true;
          break;
        }else{
           board.rows()[boardSize-depth][i] = 0;
          //  board.togglePiece(boardSize-depth,i);
        }
    }
    return solution
  }

  var solution = solutionSearch(board,depth);
  var solutionCount = solution.length;


  console.log('Number of solutions for ' + k + ' queens:', solutionCount);
  return solutionCount;
};
