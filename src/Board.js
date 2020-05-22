// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var conflict = false;
      var singleRow = this.get(rowIndex);
      var firstDetect =  false;
      for(var i=0; i<singleRow.length;i++){
         if(singleRow[i] !== 0 && firstDetect === true){
           conflict = true;
         }else if(singleRow[i] !== 0 && firstDetect === false){
           firstDetect = true;
        }
      }
      return conflict;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //initite result
      var result = false;
      //check how big is the board
      if(this.rows().length === 0){
        var boardsize = 0;
      }else{
        var boardsize = this.get(0).length;
      }
      //check each row if there is piece
      for(var i=0;i<boardsize;i++){
        result = result || this.hasRowConflictAt(i);
      }

      return result;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //initiate result
      var result = false;
      var firstDetect = false;
      //get how big the board is
      var boardsize = this.get(0).length;
      // check each row and the colIndex
      for(var i=0;i<boardsize;i++){
        var singleRow = this.get(i);
        var value  = singleRow[colIndex];
        if(value !== 0 && firstDetect === true){
          result = true;
        }else if(value !== 0 && firstDetect === false){
          firstDetect = true;
        }
      }
      return result;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //initiate result
      var result = false;
      //get board size;
      if(this.rows().length === 0){
        var boardsize = 0
      }else{
        var boardsize = this.get(0).length;
      }
      //iterate each colum and combine with currentt result
      for(var i=0;i<boardsize;i++){
        result = result || this.hasColConflictAt(i);
      }

      return result;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      //initiate result
      var result = false;
      //initiate majorDiagonalColumnIndexAtFirstRow to be "n"
      var n = majorDiagonalColumnIndexAtFirstRow;
      //get length of the board
      if(this.rows().length === 0){
        var boardSize = 0;
      }else{
        var boardSize = this.get(0).length;
      }
      //initiate diag on board
      var diagArray = [];

      // if n is greater or equal to 0
      if(n >= 0){
        for(var i=0;i<boardSize-n;i++){
          //get the first row of the board
          var singleRow = this.get(i);
          //push to diag array
          diagArray.push(singleRow[i+n]);
        }
      }else if (n < 0){
        n = Math.abs(n);
        for(var i=0;i<boardSize-n;i++){
          var singleRow = this.get(n+i);
          diagArray.push(singleRow[i]);
        }
      }


      //iterate over the diagArray
      for (let item of diagArray) {
        //if queen is dectected and result is true
        if (item === 1 && result) {
          //return true
          return true;
        //else if a queen is detected
        } else if (item === 1) {
          //make result true
          result = true;
        }
      }
      //return false
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //make a variable and set it equal to the length of the board - 2
      if(this.rows().length === 0){
        var indexOfDiag = 0;
      }else{
        var indexOfDiag = this.rows()[0].length - 2;
      }
      //iterate thru the whole board without the edge
      console.log("indexofdiag"+indexOfDiag);
      for (let i = -(indexOfDiag); i <= indexOfDiag; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      //initiate result variable
      var result = false;
      var n = minorDiagonalColumnIndexAtFirstRow;
      //initiate array for storing minor diag
      var diagArr = [];
      //get board length : BoardSize
      if(this.rows().length === 0){
        var boardSize = 0
      }else{
        var boardSize = this.get(0).length;
      }

      if(n>=0){
      //base on the input value, iterate BoardSize-input
        for(var i=0;i<boardSize-n;i++){
          // get row from i to boardsize
          var singleRow = this.get(i);
          // get collumn from boardsize-i
          //plug into the array
          diagArr.push(singleRow[(boardSize-1-n)-i]);
        }
      }else if(n<0){
        n=Math.abs(n);
        for(var i=0;i<boardSize-n;i++){
          //get row from n to boardsize
          var singleRow = this.get(i+n);
          //get column from boardisze to n
          //plug into the array
          diagArr.push(singleRow[(boardSize-1)-i]);
        }
      };
      //initate a flag -  false at beginning, true when 1st queen detected.
      var flag = false;
      // iterate through diagArr
      for(var v of diagArr){
        //if queen detected and flag is true
        if(v === 1 && flag){
          //return true
          return true;
        }else if(v === 1){
          //else if queen  detected
          //change flag to true
          flag = true;
        }
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      //make a variable and set it equal to the length of the board - 2
      if(this.rows().length ===0){
        var indexOfDiag = 0;
      }else{
        var indexOfDiag = this.rows()[0].length - 2;
      }
      //iterate thru the whole board without the edge
      for (let i = -(indexOfDiag); i <= indexOfDiag; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
