(function () {
    var ChessBoard = (function() {
        var ChessBoard = function(domElem) {
            var objInstance = new ChessBoard.fn.init(domElem);

            // Append click handler
            $(domElem).click(function(eventData) {
                ChessBoard.fn.onClick(eventData.pageX, eventData.pageY, objInstance);
            });

            return objInstance;
        };

        ChessBoard.fn = ChessBoard.prototype = {
            constructor: ChessBoard,

            // Print debugging information to the browser's console.
            isVerbose: true,

            // Coordinates of the picked piece, if any
            referenceCoords: null,
            getReferenceCoords: function() { return this.referenceCoords; },
            setReferenceCoords: function(c) { this.referenceCoords = c; return this; },

            // Renderer
            renderer: null,
            getRenderer: function() { return this.renderer; },

            // Is the game over ?
            gameEnded: false,
            hasGameEnded: function() { return this.gameEnded; },
            endGame: function() { this.gameEnded = true; },

            // Who does the player control ?
            playerSide: ChessEnums.Piece.WHITE,
            getPlayerSide: function() { return this.playerSide; },

            currentTurn: ChessEnums.Piece.WHITE,
            getCurrentTurn: function() { return this.currentTurn; },
            toggleTurn: function () {
                if (this.currentTurn & ChessEnums.Piece.WHITE)
                    this.currentTurn = ChessEnums.Piece.BLACK;
                else this.currentTurn = ChessEnums.Piece.WHITE;
            },
            
            promotionPiece: null,

            /*
             * @description Constructor
             */
            init: function(dom) {
                this.renderer = new ChessRenderer(dom);

                this.initBoard();
                this.log('ChessBoard object initialized and rendered!', true);

                return this;
            },

            /*
             * @description Changes controlled sides and turns the diagram over
             */
            switchSide: function() {
                this.playerSide = (this.playerSide == ChessEnums.Piece.BLACK) ? ChessEnums.Piece.WHITE : ChessEnums.Piece.BLACK;

                this.initBoard();
                this.getRenderer().rotate();
            },

            /*
             * @description Overload of console.log, will log only if the object
             *              is in verbose mode
             */
            log: function(str, ret) {
                if (this.isVerbose)
                    console.log('>> ' + str);
                return ret !== null ? ret : true;
            },

            /*
             * @description Used to bring the diagram back
             *              to its default layout.
             */
            initBoard: function() {
                this.currentTurn = ChessEnums.Piece.WHITE;
                for (var x = 0; x < 8; x++) {
                    for (var y = 0; y < 8; y++) {
                        this.bitBoard[y][x] = null;
                        this.getRenderer().eraseTile(x, y);

                        tileMask = (this.getPlayerSide() == ChessEnums.Piece.WHITE ? ChessEnums.Piece.BLACK : ChessEnums.Piece.WHITE);;
                        if (y > 3)
                            tileMask = this.getPlayerSide();

                        if (y == 1 || y == 6)
                            tileMask |= ChessEnums.Piece.PAWN;
                        else if (y == 0 || y == 7) {
                            switch (x) {
                                case 0: case 7: tileMask |= ChessEnums.Piece.ROOK;   break;
                                case 1: case 6: tileMask |= ChessEnums.Piece.KNIGHT; break; 
                                case 2: case 5: tileMask |= ChessEnums.Piece.BISHOP; break;
                                case 3:         tileMask |= ChessEnums.Piece.QUEEN;  break;
                                case 4:         tileMask |= ChessEnums.Piece.KING;   break;
                            }
                        }

                        if (!(y == 1 || y == 6 || y == 0 || y == 7))
                            continue;

                        var pieceObj = new Piece(tileMask, x, y, (tileMask & this.getPlayerSide()));
                        this.setPieceAt(x, y, pieceObj);
                        this.getRenderer().drawTileAt(x, y, pieceObj.getTileName());
                    }
                }
            },

            // BitBoard related functions
            bitBoard: [[],[],[],[],[],[],[],[]],
            hasPieceAt: function(x, y) { return this.bitBoard[y][x] !== null; },
            getPieceAt: function(x, y) { return this.bitBoard[y][x]; },
            setPieceAt: function(x, y, pieceObj) { this.bitBoard[y][x] = pieceObj; },
            delPieceAt: function(x, y) { this.setPieceAt(x, y, null); },
            findPiece: function (typeMask) {
                for (var x = 0; x < 8; x++)
                    for (var y = 0; y < 8; y++)
                        if ((piece = this.getPieceAt(x, y)) !== null)
                            if (piece.getTypeMask() == typeMask)
                                return piece;
                return null;
            },

            isPieceBetween: function(xi, yi, xf, yf) {
                if (Math.abs(xi - xf) == 1 || Math.abs(yi - yf) == 1)
                    return false;

                if (xi == xf) { // Vertically
                    if (yi > yf) { // Up
                        for (var y = yf + 1; y < yi; y++)
                            if (this.hasPieceAt(xi, y))
                                return true;
                    }
                    else { // Down
                        for (var y = yi + 1; y < yf; y++)
                            if (this.hasPieceAt(xi, y))
                                return true;
                    }
                }
                else if (yi == yf) { // Horizontally
                    if (xi > xf) { // Left
                        for (var x = xf + 1; x < xi; x++)
                            if (this.hasPieceAt(x, yi))
                                return true;
                    }
                    else { // Right
                        for (var x = xi + 1; x < xf; x++)
                            if (this.hasPieceAt(x, yi))
                                return true;
                    }
                }
                else if (Math.abs(xi - xf) == Math.abs(yi - yf)) { // Diagonally
                    var diff = Math.abs(xf - xi);
                    if (xi > xf) { // Left
                        if (yi > yf) { // Up
                            for (var i = 1; i < diff; i++)
                                if (this.hasPieceAt(xi - i, yi - i))
                                    return true
                        }
                        else { // Down
                            for (var i = 1; i < diff; i++)
                                if (this.hasPieceAt(xi - i, yi + i))
                                    return true;
                        }
                    }
                    else { // Right
                        if (yi > yf) { // Up
                            for (var i = 1; i < diff; i++)
                                if (this.hasPieceAt(xi + i, yi - i))
                                    return true;
                        }
                        else { // Down
                            for (var i = 1; i < diff; i++)
                                if (this.hasPieceAt(xi + i, yi + i))
                                    return true;
                        }
                    }
                }
                return false;
            },

            getMapForSide: function(colour) {
                if (colour != ChessEnums.Piece.BLACK && colour != ChessEnums.Piece.WHITE)
                    return null;

                var bitMap = [[],[],[],[],[],[],[],[]];

                for (var x = 0; x < 8; x++)
                    for (var y = 0; y < 8; y++)
                        if ((piece = this.getPieceAt(x, y)) !== null)
                            bitMap[y][x] = piece.isOfSide(colour) ? piece : null;
                        else
                            bitMap[y][x] = null;
                return bitMap;
            },

            getOppositeMapForSide: function(colour) {
                if (colour == ChessEnums.Piece.BLACK)
                    return this.getMapForSide(ChessEnums.Piece.WHITE);
                else if (colour == ChessEnums.Piece.WHITE)
                    return this.getMapForSide(ChessEnums.Piece.BLACK);

                return null;
            },

            /* 
             * @description Handles clicks on the board
             */
            onClick: function(x, y, referer) {
                // Do nothing if the game is over
                if (referer.hasGameEnded())
                    return;

                var cellSize = referer.getRenderer().getCellSize(),
                    cellX = Math.floor((x - referer.getRenderer().getOffset().left) / cellSize),
                    cellY = Math.floor((y - referer.getRenderer().getOffset().top) / cellSize);

                if ((origin = referer.getReferenceCoords()) !== null) {
                    // Check move validity - The fun starts now!
                    referer.log('------ Checking move validity now! ------');

                    // Get origin piece
                    if ((sourcePiece = referer.getPieceAt(origin[0], origin[1])) !== null) {
                        referer.log('Trying to move a ' + sourcePiece.toString() + ' to [' + cellX + ',' + cellY + ']');

                        // Cannot move if the targeted cell contains one of our pieces
                        if (referer.hasPieceAt(cellX, cellY) && referer.getPieceAt(cellX, cellY).isOfSide(sourcePiece.getSide())) {
                            referer.log('The targeted cell contains one of our pieces!');
                            return referer.setReferenceCoords(null);
                        }

                        if (sourcePiece.isAttackingCell(cellX, cellY)) {
                            // Find our king and check if he will be in check after our move
                            var ourKing = !(sourcePiece.getTypeMask() & ChessEnums.Piece.KING)
                                           ? referer.findPiece(ChessEnums.Piece.KING | sourcePiece.getSide())
                                           : sourcePiece;

                            if (ourKing === null) // Should never happen
                                return referer.log('Error, could\'t find out king!', referer).setReferenceCoords(null);

                            // 1) Will our king be in check AFTER OUR MOVE ?
                            //    Check by creating the move, then rolling it back
                            var backupPiece = referer.getPieceAt(cellX, cellY);
                            referer.setPieceAt(cellX, cellY, sourcePiece);
                            sourcePiece.coords = [cellX, cellY];
                            sourcePiece.generateAttackCells();
                            referer.delPieceAt(origin[0], origin[1]);

                            var willBeInCheck = false;
                            for (var x = 0; x < 8; x++)
                                for (var y = 0; y < 8; y++)
                                    if ((itrPiece = referer.getPieceAt(x, y)) !== null)
                                        if (itrPiece.isCheckCell(ourKing.getX(), ourKing.getY()) && !itrPiece.isOfSide(ourKing.getSide()))
                                            if (!referer.isPieceBetween(itrPiece.getX(), itrPiece.getY(), ourKing.getX(), ourKing.getY()))
                                                willBeInCheck = true;

                            // Rolling back the move
                            referer.setPieceAt(origin[0], origin[1], referer.getPieceAt(cellX, cellY));
                            referer.setPieceAt(cellX, cellY, backupPiece);
                            sourcePiece.coords = origin;
                            sourcePiece.generateAttackCells();

                            if (willBeInCheck) {
                                referer.log('Our king would be in check after trying that move.');
                                referer.log('----- Move cannot be proceeded ----');
                                referer.setReferenceCoords(null);
                                return;
                            }

                            // Check if there are ANY pieces between target and dest
                            if (!referer.isPieceBetween(origin[0], origin[1], cellX, cellY)) {
                                // Pawn handler - Diagonal moves case
                                if (Math.abs(origin[0] - cellX) != 0 && sourcePiece.getTypeMask() & ChessEnums.Piece.PAWN) {
                                    // Disallow moving forward on a busy cell
                                    if (Math.abs(origin[0] - cellX) == 0 && referer.hasPieceAt(cellX, cellY))
                                        return;

                                    if ((tPiece = this.getPieceAt(cellX, origin[1])) !== null && !tPiece.isOfSide(sourcePiece.getSide())) {
                                        // Check for En-passant cells
                                        if (backupPiece === null) {
                                            if (sourcePiece.isEnPassantCell(cellX, origin[1]) && !sourcePiece.canPerformEnPassant()) {
                                                referer.log('Cannot perform a en-passant capture!');
                                                referer.log('----- Move cannot be proceeded ----');
                                                referer.setReferenceCoords(null);
                                                return;
                                            }
                                            else if (cellY != sourcePiece.getY()) {
                                                referer.log('Valid en-passant move!');
                                                referer.delPieceAt(cellX, origin[1]);
                                                referer.getRenderer().eraseTile(cellX, origin[1]);
                                            }
                                        }
                                    }
                                    else {
                                        if (backupPiece === null) {
                                            referer.log('Cannot perform a en-passant capture, no piece to take!');
                                            referer.log('----- Move cannot be proceeded ----');
                                            referer.setReferenceCoords(null);
                                            return;
                                        }
                                    }
                                }
                                
                                // Promoting a pawn
                                if (sourcePiece.getTypeMask() & ChessEnums.Piece.PAWN && ((sourcePiece.isPlayerControlled && cellY == 0) || (!sourcePiece.isPlayerControlled && cellY == 7))) {
                                    $('div#promotionBlock').fadeIn(700);
                                    $('div#promotionBlock img').each(function() {
                                        if (sourcePiece.isOfSide(ChessEnums.Piece.BLACK))
                                            this.src = this.src.replace('imgs/w', 'imgs/b');
                                        else this.src = this.src.replace('imgs/b', 'imgs/w');
                                    });
                                    referer.promotionPiece = sourcePiece;
                                }

                                // King castling handler
                                var handleCastling = -1;
                                if (Math.abs(origin[0] - cellX) == 2 && sourcePiece.getTypeMask() & ChessEnums.Piece.KING && backupPiece === null) {
                                    if (!referer.hasPieceAt(Math.abs(cellX + origin[0]) / 2, cellY))
                                        handleCastling = (cellX > origin[0]);
                                }

                                referer.log('---- Valid move, proceeding ----');
                                referer.setReferenceCoords(null);

                                referer.setPieceAt(cellX, cellY, sourcePiece);
                                referer.delPieceAt(origin[0], origin[1]);
                                referer.getRenderer().drawTileAt(cellX, cellY, sourcePiece.getTileName());
                                referer.getRenderer().eraseTile(origin[0], origin[1]);
                                sourcePiece.coords = [cellX, cellY];
                                sourcePiece.generateAttackCells();
                                
                                // Enable, if possible, the en-passant flag
                                if (sourcePiece.getTypeMask() & ChessEnums.Piece.PAWN) {
                                    if ((cellY == 3 && sourcePiece.isPlayerControlled) || (cellY == 4 && !sourcePiece.isPlayerControlled)) {
                                        sourcePiece.setEnPassantState(1);
                                    }
                                }

                                if (handleCastling != -1 && sourcePiece.canCastle(handleCastling) && sourcePiece.getTypeMask() & ChessEnums.Piece.KING) {
                                    // Moving the rook to the castled cell
                                    var oldRookCoords = [handleCastling ? 7 : 0, cellY],
                                        newRookCoords = [handleCastling ? 5 : 3, cellY];

                                    var rook = this.getPieceAt(oldRookCoords[0], oldRookCoords[1]);
                                    referer.setPieceAt(newRookCoords[0], newRookCoords[1], rook);
                                    referer.delPieceAt(oldRookCoords[0], oldRookCoords[1]);
                                    referer.getRenderer().drawTileAt(newRookCoords[0], newRookCoords[1], rook.getTileName());
                                    referer.getRenderer().eraseTile(oldRookCoords[0], oldRookCoords[1]);
                                    rook.coords = newRookCoords;
                                    rook.generateAttackCells();
                                    sourcePiece.setCastling(handleCastling, false);
                                }

                                if (!ChessEnums.State.STATE_TESTING)
                                    referer.toggleTurn();

                                //this.writeMove(cellX, cellY, backupPiece !== null);
                                this.findCheckMate();
                            }
                            else {
                                referer.log('There are pieces between origin and destination.');
                                referer.log('----- Move cannot be proceeded ----');
                                referer.setReferenceCoords(null);
                            }
                        }
                        else {
                            referer.log('Invalid target cell.');
                            referer.log('----- Move cannot be proceeded ----');
                            referer.setReferenceCoords(null);
                        }
                    }
                }
                else {
                    if (!referer.hasPieceAt(cellX, cellY))
                        return;

                    // Do nothing if the targeted piece is not ours
                    if (!referer.getPieceAt(cellX, cellY).isOfSide(referer.getPlayerSide()) && !ChessEnums.State.STATE_TESTING)
                        return referer.log('You tried to move a piece that is not yours');

                    if (referer.getCurrentTurn() != referer.getPlayerSide() && !ChessEnums.State.STATE_TESTING)
                        return referer.log('It\'s not your turn to move.');

                    referer.setReferenceCoords([cellX, cellY]);
                    referer.log('You clicked cell [' + cellX + ',' + cellY + ']');
                    
                    if (ChessEnums.State.STATE_DUMP_ACS) {
                        referer.log('Attack cells dump:', true);
                        for (var x = 0; x < 8; x++) {
                            var str = [];
                            for (var y = 0; y < 8; y++)
                                str.push(referer.getPieceAt(cellX, cellY).attackCells[y][x]);
                            referer.log('[' + str.join(' ') + ']');
                        }
                    }
                }
            },

            /*
             * @description Tries to determine if any side won the game
             */
            findCheckMate: function() {
                var whiteKing = this.findPiece(ChessEnums.Piece.KING | ChessEnums.Piece.WHITE),
                    blackKing = this.findPiece(ChessEnums.Piece.KING | ChessEnums.Piece.BLACK),
                    whiteKingAC = whiteKing.getAttackCells(),
                    blackKingAC = blackKing.getAttackCells(),
                    blackPiecesMap = this.getOppositeMapForSide(ChessEnums.Piece.WHITE),
                    whitePiecesMap = this.getOppositeMapForSide(ChessEnums.Piece.BLACK);

                // NYI
            },
            
            promotePiece: function(to) {
                if (this.promotionPiece === null)
                    return;
                
                this.promotionPiece.promote(to);
                this.getRenderer().drawTileAt(this.promotionPiece.getX(), this.promotionPiece.getY(), this.promotionPiece.getTileName());
                this.promotionPiece = null;
            },
        };

        return ChessBoard;
    })();

    // Give the init function the ChessBoard prototype for later instantiation
    ChessBoard.fn.init.prototype = ChessBoard.fn;

    // Expose ChessBoard to the global scope
    window.ChessBoard = ChessBoard;
})(window);
