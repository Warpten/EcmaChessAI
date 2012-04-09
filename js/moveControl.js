(function() {
    var moveController = {
        _originCoords: [-1, -1],
        _destCoords: [-1, -1],
        _maxRange: 1,
        _board: null,
        
        isValid: function() {
            console.log('Origin is ' + this._originCoords);
            console.log('Dest is ' + this._destCoords);
            
            var xf = this._destCoords[0],
                yf = this._destCoords[1],
                xi = this._originCoords[0],
                yi = this._originCoords[1];
                currentCell  = this._board[yi][xi],
                destCell     = this._board[yf][xf];
                
            if (xf == xi && yf == yi)
                return false;
            
            console.log('Trying to move ' + currentCell.toString());
            
            // TODO: check and disallow if king is in check and move doesnt help
            // TODO: disallow if originPiece is pinned on the king

            // Disallow move if the targeted cell contains a piece of our side.
            if (destCell !== null)
                if ((currentCell.isBlack()) == (destCell.isBlack()))
                    return false;
            
            if (currentCell.getTypeMask() & ChessEnums.Piece.ROOK) {
                // Disallow moves on anything else than rows and columns
                if (Math.abs(xi - xf) != 0 && Math.abs(yi - yf) != 0)
                    return false;
                return this.checkRook(xi, xf, yi, yf);
            }
            else if (currentCell[0] & ChessEnums.Piece.BISHOP) {
                // Disallow moves in anything else than diagonals
                if (Math.abs(xi - xf) != Math.abs(yi - yf))
                    return false;
                return this.checkBishop(xi, xf, yi, yf);
            }
            else if (currentCell[0] & ChessEnums.Piece.KNIGHT) {
                if ((Math.abs(xi - xf) == 2 &&
                     Math.abs(yi - yf) == 1) ||
                    (Math.abs(xi - xf) == 1 &&
                     Math.abs(yi - yf) == 2))
                    return true;
                return false;
            }
            else if (currentCell[0] & ChessEnums.Piece.QUEEN) {
                if (Math.abs(xf - xi) == Math.abs(yf - yi) { // Moving on diagonals, bishop check
                    return this.checkBishop(xi, xf, yi, yf);
                }
                else if ((Math.abs(xf - xi) == 0 && Math.abs(yf - yi) <> 0) ||
                         (Math.abs(xf - xi) <> 0 && Math.abs(yf - yi) == 0)) {
                    return this.checkRook(xi, xf, yi, yf);
                }
                return false;
            }
            else if (currentCell[0] & ChessEnums.Piece.KING) {
                // King handler
            }
            else if (currentCell[0] & ChessEnums.Piece.PAWN) {
                // Pawn handler
            }
            else
                return false;
        },
        
        init: function(originCoords, destCoords, board) {
            this._board = board;
            this._originCoords = originCoords;
            this._destCoords = destCoords;
            this._maxRange = 1;
            
            return this;
        },
        
        checkBishop: function(xi, xf, yi, yf) {
            if (xf > xi) { // moving right
                if (yi > yf) { // moving up
                    for (var x = xi; x < xf; ++x)
                        for (var y = yf; y < yi; ++y)
                            if (this._board[y][x] !== null)
                                return false;
                }
                else { // if (yi < yf) { // moving down
                    for (var x = xi; x < xf; ++x)
                        for (var y = yi; y < yf; ++y)
                            if (this._board[y][x] !== null)
                                return false;
                }
                return true;
            }
            else { // if (xi > xf) { moving left
                if (yi > yf) { // moving up
                    for (var x = xf; x < xi; ++x)
                        for (var y = yf; y < yi; ++y)
                            if (this._board[y][x] !== null)
                                return false;
                }
                else { // if (yi < yf) { // moving down
                    for (var x = xf; x < xi; ++x)
                        for (var y = yi; y < yf; ++y)
                            if (this._board[y][x] !== null)
                                return false;
                }
                return true;
            }
            return false;
        },
        
        checkRook: function(xi, xf, yi, yf) {
            if (xf == xi) { // moving on y
                if (yf > yi) { // moving down
                    for (var y = yi; y < yf; ++y)
                        if (this._board[y][xi] !== null)
                            return false;
                }
                else { // if (yf < yi) // moving up
                    for (var y = yf; y < yi; ++y)
                        if (this._board[y][xi] !== null)
                            return false;
                }
                return true;
            }
            else { // if (yf == yi) // moving on x
                if (xf > xi) { // moving right
                    for (var x = xi; x < xf; ++x)
                        if (this._board[yi][x] !== null)
                            return false;
                }
                else { // if (xf < xi) // moving left
                    for (var x = xf; x < xi; ++x)
                        if (this._board[yi][x] !== null)
                            return false;
                }
                return true;
            }
            return false;
        },
    };

    window.moveController = moveController;
})(window);
