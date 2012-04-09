(function (window, undefined) {
    var ChessEnums = {
        Turn: {
            TURN_WHITE: 1,
            TURN_BLACK: -1,
        },
        
        Piece: {
            KING:   0x001,
            QUEEN:  0x002,
            KNIGHT: 0x004,
            BISHOP: 0x008,
            ROOK:   0x010,
            PAWN:   0x020,
            
            BLACK:  0x100,
            WHITE:  0x200,
        },
        
        BitMap: {
            KING_POSSIBLE_DEST   : 0x01000,
            QUEEN_POSSIBLE_DEST  : 0x02000,
            KNIGHT_POSSIBLE_DEST : 0x04000,
            BISHOP_POSSIBLE_DEST : 0x08000,
            ROOK_POSSIBLE_DEST   : 0x10000,
            PAWN_POSSIBLE_DEST   : 0x20000,
            
            POSSIBLE_DEST_BLACK  : 0x40000,
            POSSIBLE_DEST_WHITE  : 0x80000,
        }
    };

    window.ChessEnums = ChessEnums;
})(window);
