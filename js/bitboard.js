(function () {
    var bitBoard = (function() {
        var bitBoard = function() {
            return new bitBoard.fn.init();
        };

        bitBoard.fn = bitBoard.prototype = {
            constructor: bitBoard,
            
            bBoard: [[],[],[],[],[],[],[],[]],

            init: function() {
                for (var y = 0; y < 8; y++)
                    for (var x = 0; x < 8; x++)
                        this.bBoard[x][y] = null;
                return this;
            },
            
            getPieceAt: function(x, y) {
                return this.bBoard[y][x];
            },
            
            setPieceAt: function(x, y, pieceObject) {
                this.bBoard[y][x] = pieceObject;
            },
            
            rmPieceAt: function (x,y) { this.setPieceAt(x, y, null); },
            
            hasPieceAt: function(x, y) {
                return this.bBoard[y][x] !== null;
            },
            
            moveFromTo: function (xi, yi, xf, yf)
            {
                this.bBoard[yf][xf] = this.bBoard[yi][xi];
            },
        };

        return bitBoard;
    })();

    // Give the init function the bitBoard prototype for later instantiation
    bitBoard.fn.init.prototype = bitBoard.fn;

    // Expose bitBoard to the global scope
    window.bitBoard = bitBoard;
})(window);
