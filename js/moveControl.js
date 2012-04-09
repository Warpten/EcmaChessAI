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
            
            if (currentPiece.getTypeMask() & ChessEnums.Piece.ROOK) {
                // Disallow moves on anything else than rows and columns
                if (Math.abs(this._originCoords[0] - this._destCoords[0]) != 0
                    && Math.abs(this._originCoords[1] - this._destCoords[1]) != 0)
                    return false;
                
                return true;
            } else if (currentPiece[0] & ChessEnums.Piece.BISHOP) {
                // Disallow moves in anything else than diagonals
                if (Math.abs(this._originCoords[0] - this._destCoords[0]) != Math.abs(this._originCoords[1] - this._destCoords[1]))
                    return false;
                return true;
            } else if (currentPiece[0] & ChessEnums.Piece.KNIGHT) {
                if ((Math.abs(this._originCoords[0] - this._destCoords[0]) == 2 &&
                     Math.abs(this._originCoords[1] - this._destCoords[1]) == 1) ||
                    (Math.abs(this._originCoords[0] - this._destCoords[0]) == 1 &&
                     Math.abs(this._originCoords[1] - this._destCoords[1]) == 2))
                    return true;
                return false;
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
