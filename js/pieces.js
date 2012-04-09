(function () {
    var Piece = (function() {
        var Piece = function(coords, tileID) {
            var typeMask = 0;
            if (tileID < Tiles.TILE_WHITE_KING)
                typeMask |= ChessEnums.Piece.BLACK;
            else typeMask |= ChessEnums.Piece.WHITE;
            
            switch (tileID)
            {
                case Tiles.TILE_BLACK_KING:
                case Tiles.TILE_WHITE_KING:
                    typeMask |= ChessEnums.Piece.KING;
                    break;
                case Tiles.TILE_BLACK_QUEEN:
                case Tiles.TILE_WHITE_QUEEN:
                    typeMask |= ChessEnums.Piece.QUEEN;
                    break;
                case Tiles.TILE_BLACK_KNIGHT:
                case Tiles.TILE_WHITE_KNIGHT:
                    typeMask |= ChessEnums.Piece.KNIGTH;
                    break;
                case Tiles.TILE_BLACK_BISHOP:
                case Tiles.TILE_WHITE_BISHOP:
                    typeMask |= ChessEnums.Piece.BISHOP;
                    break;
                case Tiles.TILE_BLACK_ROOK:
                case Tiles.TILE_WHITE_ROOK:
                    typeMask |= ChessEnums.Piece.ROOK;
                    break;
                case Tiles.TILE_BLACK_PAWN:
                case Tiles.TILE_WHITE_PAWN:
                    typeMask |= ChessEnums.Piece.PAWN;
                    break;
            }
            return new Piece.fn.init(coords, typeMask);
        };

        Piece.fn = Piece.prototype = {
            // Describes the piece
            typeMask: null,
            
            // Cell coordinates on the board [x, y]
            coords: [-1, -1],
        
            constructor: Piece,

            /*
             * @description Class constructor
             * @returns     Instance of the object, or false if an invalid
             *              DOM element has been passed as a parameter.
             */
            init: function(coords, typeMask) {
                this.typeMask = typeMask;
                this.coords = coords;
                return this;
            },
            
            isBlack: function() { return this.typeMask & ChessEnums.Piece.BLACK; },
            isWhite: function() { return this.typeMask & ChessEnums.Piece.WHITE; },
            getTypeMask: function() { return this.typeMask; },
            toString: function() {
                if (this.typeMask & ChessEnums.Piece.ROOK)
                    return (this.isBlack() ? 'Black' : 'White') + ' Tower';
                if (this.typeMask & ChessEnums.Piece.QUEEN)
                    return (this.isBlack() ? 'Black' : 'White') + ' Queen';
                if (this.typeMask & ChessEnums.Piece.BISHOP)
                    return (this.isBlack() ? 'Black' : 'White') + ' Bishop';
                if (this.typeMask & ChessEnums.Piece.KING)
                    return (this.isBlack() ? 'Black' : 'White') + ' King';
                if (this.typeMask & ChessEnums.Piece.KNIGHT)
                    return (this.isBlack() ? 'Black' : 'White') + ' Knight';
                if (this.typeMask & ChessEnums.Piece.PAWN)
                    return (this.isBlack() ? 'Black' : 'White') + ' Pawn';                
                return 'Error, typemask is ' + this.typeMask + ', piece is ' + (this.isBlack() ? 'black' : 'white');
            },
        };

        return Piece;
    })();

    // Give the init function the Piece prototype for later instantiation
    Piece.fn.init.prototype = Piece.fn;

    // Expose Piece to the global scope
    window.Piece = Piece;
})(window);
