(function () {
    var Piece = (function() {
        var Piece = function(typeMask, x, y, plrControl) {
            return new Piece.fn.init(typeMask, [x, y], plrControl);
        };

        Piece.fn = Piece.prototype = {
            constructor: Piece,

            coords: null,

            typeMask: 0,
            tileImage: '',
            name: '',
            attackCells: null,

            isPlayerControlled: false,
            toggleControl: function() { this.isPlayerControlled = !this.isPlayerControlled; },
            
            init: function(typeMask, coords, isPlayerControlling) {
                this.typeMask = typeMask;
                this.coords   = coords;
                this.isPlayerControlled = isPlayerControlling;
                
                var tileName = 'w';
                this.name = 'White ';
                this.side = ChessEnums.Piece.WHITE;
                if (typeMask & ChessEnums.Piece.BLACK) {
                    tileName = 'b';
                    this.name = 'Black ';
                    this.side = ChessEnums.Piece.BLACK;
                }
                
                var charMap = 'kqnbrp';
                for (var x = 0; x < 6; x++)
                    if (typeMask & (1 << x))
                        tileName += charMap.charAt(x);
                
                if (typeMask & ChessEnums.Piece.KING)
                    this.name += 'King';
                if (typeMask & ChessEnums.Piece.QUEEN)
                    this.name += 'Queen';
                if (typeMask & ChessEnums.Piece.KNIGHT)
                    this.name += 'Knight';
                if (typeMask & ChessEnums.Piece.BISHOP)
                    this.name += 'Bishop';
                if (typeMask & ChessEnums.Piece.ROOK)
                    this.name += 'Rook';
                if (typeMask & ChessEnums.Piece.PAWN)
                    this.name += 'Pawn';

                this.tileImage = tileName;
                this.generateAttackCells();
                
                return this;
            },
            
            getTileName: function() { return this.tileImage; },
            getTypeMask: function() { return this.typeMask; },
            getX: function() { return this.coords[0]; },
            getY: function() { return this.coords[1]; },
            getSide: function() { return this.side; },
            isOfSide: function(t) { return this.side == t; },
            
            toString: function() { return (this.isPlayerControlled ? 'Player-controlled ' : 'AI-controlled ') + this.name + ' at [' + this.coords.toString() + ']'; },
            
            getAttackCells: function() { return this.attackCells; },
            generateAttackCells: function() {
                var xi = this.getX(),
                    yi = this.getY();
                
                //! JS Shit in the hole: if the map was to be defined in the object's
                //! parameters, its generating would be totally fucked up.
                //! @Phoenix35: investigate this crap !
                this.attackCells = [[],[],[],[],[],[],[],[]];
                for (var x = 0; x < 8; x++) {
                    for (var y = 0; y < 8; y++) {
                        this.attackCells[x][y] = 0;
                        
                        if (this.getTypeMask() & ChessEnums.Piece.KING)
                            if (Math.abs(x - xi) < 2 && Math.abs(y - yi) < 2)
                                this.attackCells[x][y] = 1;

                        if (this.getTypeMask() & ChessEnums.Piece.KNIGHT)
                            if ((Math.abs(x - xi) == 2 && Math.abs(y - yi) == 1) || (Math.abs(x - xi) == 1 && Math.abs(y - yi) == 2))
                                this.attackCells[x][y] = 1;

                        if (this.getTypeMask() & ChessEnums.Piece.PAWN) {
                            var maxRange = 1;
                            if ((yi == 1 && !this.isPlayerControlled) || (yi == 6 && this.isPlayerControlled))
                                maxRange = 2;

                            if (x == xi && maxRange > (Math.abs(y - yi) - 1) && yi >= y && this.isPlayerControlled)
                                this.attackCells[x][y] = 1;
                            if (x == xi && maxRange > (Math.abs(y - yi) - 1) && yi <= y && !this.isPlayerControlled)
                                this.attackCells[x][y] = 1;
                        }

                        if ((this.getTypeMask() & ChessEnums.Piece.BISHOP) || (this.getTypeMask() & ChessEnums.Piece.QUEEN))
                            if (Math.abs(x - xi) == Math.abs(y - yi))
                                this.attackCells[x][y] = 1;

                        if ((this.getTypeMask() & ChessEnums.Piece.ROOK) || (this.getTypeMask() & ChessEnums.Piece.QUEEN))
                            if ((Math.abs(x - xi) == 0 && Math.abs(y - yi) != 0) || (Math.abs(x - xi) != 0 && Math.abs(y - yi) == 0))
                                this.attackCells[x][y] = 1;
                    }
                }
                // Our current position is always a valid attack cell.
                this.attackCells[xi][yi] = 1;
                return this.attackCells;
            },

            isAttackingCell: function(x, y) {
                return this.attackCells[x][y] == 1;
            },
        };

        return Piece;
    })();

    // Give the init function the Piece prototype for later instantiation
    Piece.fn.init.prototype = Piece.fn;

    // Expose Piece to the global scope
    window.Piece = Piece;
})(window);
