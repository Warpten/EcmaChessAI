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

            // Controls castling -- wb ws bb bs
            castleState: [true, true, true, true],

            // Board
            bitBoard: [[],[],[],[],[],[],[],[]],

            // Debug
            isVerbose: true,

            // Coordinates of the first click
            referenceCoords: null,

            playerSide: ChessEnums.Piece.WHITE,

            init: function(dom) {
                this.renderer = new ChessRenderer(dom);
                this.log('ChessBoard object initialized!', true);
                
                this.initBoard();
                return this;
            },

            log: function(str, ret) {
                if (this.isVerbose)
                    console.log(str);
                return ret;
            },

            getPlayerSide: function() { return this.playerSide; },
            switchSide: function() {
                if (this.playerSide == ChessEnums.Piece.BLACK)
                    this.playerSide = ChessEnums.Piece.WHITE;
                else
                    this.playerSide = ChessEnums.Piece.BLACK;
                this.initBoard();
                this.getRenderer().rotate();
            },

            getRenderer: function() { return this.renderer; },

            /*
             * @description Used to bring the diagram back
             *              to its default layout.
             */
            initBoard: function() {
                for (var x = 0; x < 8; x++) {
                    for (var y = 0; y < 8; y++) {
                        this.bitBoard[y][x] = null;

                        tileMask = 0;
                        if (y > 3) {
                            tileMask |= this.getPlayerSide();
                        }
                        else {
                            tileMask |= (this.getPlayerSide() == ChessEnums.Piece.WHITE ? ChessEnums.Piece.BLACK : ChessEnums.Piece.WHITE);
                        }

                        if (y == 1 || y == 6) {
                            tileMask |= ChessEnums.Piece.PAWN;

                            var pieceObj = new Piece(tileMask, x, y, (tileMask & this.getPlayerSide()));
                            this.setPieceAt(x, y, pieceObj);
                            this.getRenderer().drawTileAt(x, y, pieceObj.getTileName());
                        }
                        else if (y == 0 || y == 7) {
                            switch (x) {
                                case 0: case 7: tileMask |= ChessEnums.Piece.ROOK;   break;
                                case 1: case 6: tileMask |= ChessEnums.Piece.KNIGHT; break; 
                                case 2: case 5: tileMask |= ChessEnums.Piece.BISHOP; break;
                                case 3:         tileMask |= ChessEnums.Piece.QUEEN;  break;
                                case 4:         tileMask |= ChessEnums.Piece.KING;   break;
                            }
                            var pieceObj = new Piece(tileMask, x, y, (tileMask & this.getPlayerSide()));
                            this.setPieceAt(x, y, pieceObj);
                            this.getRenderer().drawTileAt(x, y, pieceObj.getTileName());
                        }
                    }
                }
            },

            // BitBoard related functions
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
                        for (var y = yi - 1; y < yf; y++)
                            if (this.hasPieceAt(xi, y))
                                return true;
                    }
                }
                else if (yi == yf) { // Horizontally
                    if (xi > xf) { // Left
                        for (var x = xf - 1; x < xi; x++)
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
                    if (xi > xf) { // Left
                        var diff = xi - xf;
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
                        var diff = xf - xi;
                        if (yi > yf) { // Up
                            for (var i = 1; i < diff; i++)
                                if (this.hasPieceAt(xi + i, yi - i))
                                    return true;
                        }
                        else { // Down
                            for (var i = 1; i < diff; i++)
                                if (this.hasPieceAt(xi + i, yi + i))
                                    return true
                        }
                    }
                }
                return false;
            },

            getMapForSide: function(colour) {
                if (colour != ChessEnums.Pieces.BLACK && colour != ChessEnums.Pieces.WHITE)
                    return null;
                
                var bitMap = [[],[],[],[],[],[],[],[]];
                
                for (var x = 0; x < 8; x++)
                    for (var y = 0; y < 8; y++)
                        if ((piece = this.getPieceAt(x, y)) !== null)
                            bitMap[y][x] = (int)(piece.isOfColour(colour));
                        else
                            bitMap[y][x] = 0;
                return bitMap;
            },
            
            getOppositeMapForSide: function(colour) {
                if (colour == ChessEnums.Pieces.BLACK)
                    return this.getMapForSide(ChessEnums.Pieces.WHITE);
                else if (colour == ChessEnums.Pieces.WHITE)
                    return this.getMapForSide(ChessEnums.Pieces.BLACK);
                
                return null;
            },
            
            getReferenceCoords: function() { return this.referenceCoords; },
            setReferenceCoords: function(c) { this.referenceCoords = c; return this; },
            
            onClick: function(x, y, referer) {
                var offsets = referer.getRenderer().getOffset(),
                    offX = offsets.left,
                    offY = offsets.top,
                    cellSize = referer.getRenderer().getCellSize(),
                    cellX = Math.floor((x - offX) / cellSize),
                    cellY = Math.floor((y - offY) / cellSize);
                
                if ((origin = referer.getReferenceCoords()) != null) {
                    // Check move validity - The fun starts now!
                    referer.log('------ Checking move validity now! ------', true);
                    
                    // Get origin piece
                    if ((sourcePiece = referer.getPieceAt(origin[0], origin[1])) != null) {
                        referer.log('Trying to move a ' + sourcePiece.toString() + ' from [' + origin.toString() + '] to [' + cellX + ',' + cellY + ']', true);
                        
                        // Logging source attack cells
                        referer.log('Dumping attack cells for the moving piece...', true);
                        for (var x = 0; x < 8; x++)
                        {
                            var str = '';
                            for (var y = 0; y < 8; y++)
                                str += sourcePiece.attackCells[y][x] + ' ';
                            referer.log(str, true);
                        }
                        
                        // Cannot move if the targeted cell contains one of our pieces
                        if (referer.hasPieceAt(cellX, cellY))
                            if (referer.getPieceAt(cellX, cellY).isOfSide(sourcePiece.getSide())) {
                                console.log('The targeted cell contains one of our pieces!', true);
                                return referer.setReferenceCoords(null);
                            }
                        
                        if (sourcePiece.isAttackingCell(cellX, cellY)) {
                            // Find our king and check:
                            // 1) If he will be in check after our move
                            // 2) If he is in check
                            var ourKing = referer.findPiece(ChessEnums.Piece.KING | sourcePiece.getSide());
                            
                            if (ourKing === null) { // Should never happen
                                referer.log('Could\'t find out king!', true);
                                return;
                            }
                            //!!! CHECK DETECTION FAILING SOMEHOW
                            
                            // 1) Will our king be in check AFTER OUR MOVE ?
                            var backupPiece = referer.getPieceAt(cellX, cellY);
                            referer.setPieceAt(cellX, cellY, sourcePiece);
                            sourcePiece.coords = [cellX, cellY];
                            sourcePiece.generateAttackCells();
                            referer.delPieceAt(origin[0], origin[1]);
                            var willBeInCheck = false;
                            for (var x = 0; x < 8; x++)
                                for (var y = 0; y < 8; y++)
                                    if ((itrPiece = referer.getPieceAt(x, y)) !== null)
                                        if (itrPiece.isAttackingCell(ourKing.getX(), ourKing.getY()) && !itrPiece.isOfSide(ourKing.getSide()))
                                            if (!referer.isPieceBetween(itrPiece.getX(), itrPiece.getY(), ourKing.getX(), ourKing.getY()))
                                                willBeInCheck = true;

                            referer.setPieceAt(origin[0], origin[1], referer.getPieceAt(cellX, cellY));
                            referer.setPieceAt(cellX, cellY, backupPiece);
                            sourcePiece.coords = origin;
                            sourcePiece.generateAttackCells();

                            if (willBeInCheck) {
                                referer.log('Our king would be in check.', true);
                                referer.log('----- Move cannot be proceeded ----', true);
                                referer.setReferenceCoords(null);
                                return;
                            }
                            
                            // 2) Is our king in check AT THE MOMENT ?
                            var isInCheck = false;
                            for (var x = 0; x < 8; x++)
                                for (var y = 0; y < 8; y++)
                                    if ((itrPiece = referer.getPieceAt(x, y)) !== null)
                                        if (itrPiece.isAttackingCell(ourKing.getX(), ourKing.getY()) && !itrPiece.isOfSide(ourKing.getSide()))
                                            if (!referer.isPieceBetween(itrPiece.getX(), itrPiece.getY(), ourKing.getX(), ourKing.getY()))
                                                isInCheck = true;
                             
                            if (isInCheck) {
                                referer.log('Our king is in check.', true);
                                referer.log('----- Move cannot be proceeded ----', true);
                                referer.setReferenceCoords(null);
                                return;
                            }
                            else {
                                // Check if there are ANY pieces between target and dest
                                if (!referer.isPieceBetween(origin[0], origin[1], cellX, cellY)) {
                                
                                    referer.log('----- Valid move, proceeding -----', true);
                                    referer.setReferenceCoords(null);
                                    
                                    referer.setPieceAt(cellX, cellY, sourcePiece);
                                    referer.delPieceAt(origin[0], origin[1]);
                                    referer.getRenderer().drawTileAt(cellX, cellY, sourcePiece.getTileName());
                                    referer.getRenderer().eraseTile(origin[0], origin[1]);
                                    sourcePiece.coords = [cellX, cellY];
                                    sourcePiece.generateAttackCells();
                                }
                                else {
                                    referer.log('There are pieces between origin and destination.', true);
                                    referer.log('----- Move cannot be proceeded ----', true);
                                    referer.setReferenceCoords(null);
                                }
                            }
                        }
                        else {
                            referer.log('Invalid target cell.', true);
                            referer.log('----- Move cannot be proceeded ----', true);
                            referer.setReferenceCoords(null);
                        }
                    }
                }
                else {
                    if (!referer.hasPieceAt(cellX, cellY))
                        return;
                    referer.setReferenceCoords([cellX, cellY]);
                    referer.log('You clicked cell [' + cellX + ',' + cellY + ']', true);
                }
            },
        };

        return ChessBoard;
    })();

    // Give the init function the ChessBoard prototype for later instantiation
    ChessBoard.fn.init.prototype = ChessBoard.fn;

    // Expose ChessBoard to the global scope
    window.ChessBoard = ChessBoard;
})(window);
