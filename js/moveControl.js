(function() {
    var moveController = {
        _originCoords: [-1, -1],
        _destCoords: [-1, -1],
        _maxRange: 1,
        _board: null,
        
        isValid: function() {
            var currentPiece = this._board[this._originCoords[0]][this._originCoords[1]];
            var destCell = this._board[this._destCoords[0]][this._destCoords[1]];
            
            // Disallow move if the targeted cell contains a piece of our side.
            if ((currentPiece[0] & ChessEnums.Piece.Black) == (destCell[0] & ChessEnums.Piece.Black))
                return false;
            
            if (currentPiece[0] & ChessEnums.Piece.ROOK) {
                // Disallow moves on anything else than rows and columns
                if (Math.abs(this._originCoords[0] - this.destCoords[0]) != 0
                    && Math.abs(this._originCoords[1] - this.destCoords[1]) != 0)
                    return false;
                
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
        }
    };

    window.moveController = moveController;
})(window);
