(function (window) {
    var Tiles = {
        tileMap: [],
        
        TILE_BLACK_KING   : 0,
        TILE_BLACK_QUEEN  : 1,
        TILE_BLACK_KNIGHT : 2,
        TILE_BLACK_BISHOP : 3,
        TILE_BLACK_ROOK   : 4,
        TILE_BLACK_PAWN   : 5,
        
        TILE_WHITE_KING   : 6,
        TILE_WHITE_QUEEN  : 7,
        TILE_WHITE_KNIGHT : 8,
        TILE_WHITE_BISHOP : 9,
        TILE_WHITE_ROOK   : 10,
        TILE_WHITE_PAWN   : 11,
        
        MAX_TILE_NUMBER   : 12,
        
        initTiles: function() {
            this.tileMap[this.TILE_BLACK_KING]   = './imgs/bk.png';
            this.tileMap[this.TILE_BLACK_QUEEN]  = './imgs/bq.png';
            this.tileMap[this.TILE_BLACK_KNIGHT] = './imgs/bn.png';
            this.tileMap[this.TILE_BLACK_BISHOP] = './imgs/bb.png';
            this.tileMap[this.TILE_BLACK_ROOK]   = './imgs/br.png';
            this.tileMap[this.TILE_BLACK_PAWN]   = './imgs/bp.png';
            
            this.tileMap[this.TILE_WHITE_KING]   = './imgs/wk.png';
            this.tileMap[this.TILE_WHITE_QUEEN]  = './imgs/wq.png';
            this.tileMap[this.TILE_WHITE_KNIGHT] = './imgs/wn.png';
            this.tileMap[this.TILE_WHITE_BISHOP] = './imgs/wb.png';
            this.tileMap[this.TILE_WHITE_ROOK]   = './imgs/wr.png';
            this.tileMap[this.TILE_WHITE_PAWN]   = './imgs/wp.png';
        },
        
        getTile: function(tileId) { return this.tileMap[tileId]; }
    };

    window.Tiles = Tiles;
})(window);