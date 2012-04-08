(function () {
    var Piece = (function() {
        var Piece = function(coords, typeMask) {
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
        };

        return Piece;
    })();

    // Give the init function the Piece prototype for later instantiation
    Piece.fn.init.prototype = Piece.fn;

    // Expose Piece to the global scope
    window.Piece = Piece;
})(window);
