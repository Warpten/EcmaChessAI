(function() {
    var moveController = {
        _originCoords: [-1, -1],
        _destCoords: [-1, -1],
        _maxRange: 1,
        _board: null,
        
        isValid: function() {
            console.log('Origin is ' + this._originCoords);
            console.log('Dest is ' + this._destCoords);
        
            var currentPiece = this._board[this._originCoords[1]][this._originCoords[0]];
            var destCell = this._board[this._destCoords[1]][this._destCoords[0]];
            
            console.log('Trying to move ' + currentPiece.toString());

            // Disallow move if the targeted cell contains a piece of our side.
            if (destCell !== null)
                if ((currentPiece.isBlack()) == (destCell.isBlack()))
                    return false;
            
            if (currentPiece.getTypeMask() & ChessEnums.Piece.ROOK) { // Rook handler
                // Disallow moves on anything else than rows and columns
                if (Math.abs(this._originCoords[0] - this._destCoords[0]) != 0
                    && Math.abs(this._originCoords[1] - this._destCoords[1]) != 0)
                    return false;
                
                for (var fItr = 0; fItr <= 1; fItr++) {
                    if (Math.abs(this._originCoords[fItr] - this._destCoords[fItr]) == 0) {
                        var sItr = (fItr == 0) ? 1 : 0,
                            increment = (this._originCoords[sItr] > this._destCoords[sItr]) ? 1 : -1;

                        for (var i = this._destCoords[sItr]; i < this._originCoords[sItr]; i += increment)
                            if (this._board[i][this._originCoords[fItr]] !== null)
                                return false;
                    }
                }
                
                return true;
            } else if (currentPiece[0] & ChessEnums.Piece.BISHOP) {
                // Bishop handler
            } else if (currentPiece[0] & ChessEnums.Piece.KNIGHT) {
                // Knight handler
            } else if (currentPiece[0] & ChessEnums.Piece.QUEEN) {
                // Queen handler
            } else if (currentPiece[0] & ChessEnums.Piece.KING) {
                // King handler
            } else if (currentPiece[0] & ChessEnums.Piece.PAWN) {
                // Pawn handler
            } else
                return false;
        },
        
        init: function(originCoords, destCoords, board) {
            this._board = board;
            this._originCoords = originCoords;
            this._destCoords = destCoords;
            this._maxRange = 1;
            
            return this;
        }
    };

    window.moveController = moveController;
})(window);
