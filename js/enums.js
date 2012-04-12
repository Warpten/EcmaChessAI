(function (window, undefined) {
    var ChessEnums = {
        Piece: {
            KING:   1 << 0,
            QUEEN:  1 << 1,
            KNIGHT: 1 << 2,
            BISHOP: 1 << 3,
            ROOK:   1 << 4,
            PAWN:   1 << 5,

            BLACK:  1 << 6,
            WHITE:  1 << 7,
        },

        State: {
            STATE_DUMP_ACS: false,   // Dump attack cells
            STATE_TESTING:  false,   // Enables/Disables side toggling after a move has been done
        },
    };

    window.ChessEnums = ChessEnums;
})(window);
